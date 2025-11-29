import { createAPI } from "./client";
import { performance } from "perf_hooks";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  reset: "\x1b[0m",
};

interface TestResult {
  endpoint: string;
  firstCallTime: number;
  secondCallTime: number;
  speedup: number;
  cacheHit: boolean;
}

async function testCaching(disableCache?: boolean) {
  console.log(`${colors.cyan}========================================`);
  console.log("SDK Cache Performance Test");
  console.log(`========================================${colors.reset}\n`);

  const cachingEnabled = !disableCache;

  console.log(
    `${colors.blue}Test: ${
      cachingEnabled ? "CACHE ENABLED" : "CACHE DISABLED"
    }${colors.reset}`
  );

  // Create API instance with desired caching mode
  const api = createAPI({
    baseUrl: "https://api2.warera.io/trpc",
    cacheTTL: 300000,
    cache: disableCache ? null : undefined, // null disables, undefined uses default in-memory
  });

  const results: TestResult[] = [];

  const testCases = [
    {
      name: "country.getAllCountries",
      call: () => api.country.getAllCountries(),
    },
    {
      name: "gameConfig.getGameConfig",
      call: () => api.gameConfig.getGameConfig(),
    },
    {
      name: "user.getUserLite",
      call: () => api.user.getUserLite("69119801a31120403f07ffd8"),
    },
  ];

  for (const test of testCases) {
    console.log(`\n${colors.yellow}Testing: ${test.name}${colors.reset}`);

    // First call (always API)
    const start1 = performance.now();
    try {
      const res1 = await test.call();
      const end1 = performance.now();
      const firstCallTime = end1 - start1;

      console.log(
        `  First call:  ${firstCallTime.toFixed(2)}ms ${colors.cyan}(API call)${
          colors.reset
        }`
      );
      console.log("Response:", res1);

      // Second call behavior depends on caching mode
      const start2 = performance.now();
      const res2 = await test.call();
      const end2 = performance.now();
      const secondCallTime = end2 - start2;

      let secondCallLabel;
      let speedupText;

      if (cachingEnabled) {
        const speedup = firstCallTime / secondCallTime;
        const cacheHit = speedup > 2;

        secondCallLabel = cacheHit
          ? `${colors.green}(CACHE HIT)`
          : `${colors.red}(NO CACHE)`;

        speedupText = `${speedup.toFixed(2)}x ${cacheHit ? "✓" : "✗"}`;

        results.push({
          endpoint: test.name,
          firstCallTime,
          secondCallTime,
          speedup,
          cacheHit,
        });
      } else {
        secondCallLabel = `${colors.red}(CACHING DISABLED)`;
        speedupText = "N/A";

        results.push({
          endpoint: test.name,
          firstCallTime,
          secondCallTime,
          speedup: 1,
          cacheHit: false,
        });
      }

      console.log(
        `  Second call: ${secondCallTime.toFixed(2)}ms ${secondCallLabel}${
          colors.reset
        }`
      );
      console.log("Response:", res2);
      console.log(`  Speedup:     ${speedupText}`);
      if (JSON.stringify(res1) !== JSON.stringify(res2)) {
        console.warn("Responses don't match!");
      }
    } catch (error) {
      console.log(`  ${colors.red}Error: ${error}${colors.reset}`);
    }
  }

  // Summary
  console.log(`\n\n${colors.cyan}========================================`);
  console.log("Summary");
  console.log(`========================================${colors.reset}\n`);

  const passedTests = results.filter((r) => r.cacheHit).length;
  const totalTests = results.length;

  results.forEach((result) => {
    const status = result.cacheHit
      ? `${colors.green}✓ PASS${colors.reset}`
      : `${colors.red}✗ FAIL${colors.reset}`;
    console.log(
      `${status} ${result.endpoint} (${result.speedup.toFixed(2)}x faster)`
    );
  });

  console.log(`\n${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log(`${colors.green}All cache tests passed! ✓${colors.reset}`);
  } else {
    console.log(`${colors.red}Some cache tests failed ✗${colors.reset}`);
    console.log(
      `${colors.yellow}Note: Cache might not be working correctly${colors.reset}`
    );
  }

  console.log(
    `\n${colors.cyan}========================================${colors.reset}\n`
  );
}

async function testRateLimiting() {
  console.log(`${colors.magenta}========================================`);
  console.log("SDK Rate Limiting Test");
  console.log(`========================================${colors.reset}\n`);

  // Create API with aggressive rate limiting for testing:
  // 5 requests per 10 seconds, start backoff at 40% (2 requests)
  const api = createAPI({
    baseUrl: "https://api2.warera.io/trpc",
    cache: null, // Disable caching to ensure real requests
    rateLimit: {
      maxRequests: 5,
      windowMs: 10000, // 10 seconds
      backoffThreshold: 0.4, // Start backing off at 40% (2 requests)
      maxBackoffMs: 2000, // Max 2 second delay
      throwOnLimit: false, // Wait instead of throwing
    },
  });

  console.log(
    `${colors.blue}Rate Limit Config: 5 requests per 10 seconds${colors.reset}`
  );
  console.log(
    `${colors.blue}Backoff starts at: 40% (after 2 requests)${colors.reset}`
  );
  console.log(`${colors.blue}Max backoff delay: 2000ms${colors.reset}\n`);

  const requestTimes: number[] = [];
  const totalRequests = 8;

  console.log(
    `${colors.yellow}Making ${totalRequests} rapid requests...${colors.reset}\n`
  );

  for (let i = 1; i <= totalRequests; i++) {
    const status = api.getRateLimitStatus();
    const statusStr = status
      ? `[${status.requestCount}/${status.maxRequests}] ${status.usagePercent}% | Backoff: ${status.currentBackoffMs}ms`
      : "Rate limiting disabled";

    console.log(
      `${colors.cyan}Request #${i}${colors.reset} - Before: ${statusStr}`
    );

    const start = performance.now();
    try {
      // Use a lightweight endpoint
      await api.gameConfig.getDates();
      const end = performance.now();
      const duration = end - start;
      requestTimes.push(duration);

      const statusAfter = api.getRateLimitStatus();
      const colorCode =
        duration > 500
          ? colors.yellow
          : duration > 1000
          ? colors.red
          : colors.green;

      console.log(
        `  ${colorCode}Completed in ${duration.toFixed(0)}ms${colors.reset}`
      );

      if (statusAfter) {
        const limitWarning = statusAfter.isAtLimit
          ? ` ${colors.red}(AT LIMIT!)${colors.reset}`
          : "";
        console.log(
          `  After: [${statusAfter.requestCount}/${statusAfter.maxRequests}] ${statusAfter.usagePercent}%${limitWarning}\n`
        );
      }
    } catch (error) {
      const end = performance.now();
      requestTimes.push(end - start);
      console.log(`  ${colors.red}Error: ${error}${colors.reset}\n`);
    }
  }

  // Summary
  console.log(`${colors.magenta}========================================`);
  console.log("Rate Limiting Summary");
  console.log(`========================================${colors.reset}\n`);

  const avgTime = requestTimes.reduce((a, b) => a + b, 0) / requestTimes.length;
  const totalTime = requestTimes.reduce((a, b) => a + b, 0);

  // First 2 requests should be fast (below threshold)
  const fastRequests = requestTimes.slice(0, 2);
  const slowRequests = requestTimes.slice(2);

  const avgFast =
    fastRequests.length > 0
      ? fastRequests.reduce((a, b) => a + b, 0) / fastRequests.length
      : 0;
  const avgSlow =
    slowRequests.length > 0
      ? slowRequests.reduce((a, b) => a + b, 0) / slowRequests.length
      : 0;

  console.log(`Total requests:     ${totalRequests}`);
  console.log(`Total time:         ${totalTime.toFixed(0)}ms`);
  console.log(`Average time:       ${avgTime.toFixed(0)}ms`);
  console.log(
    `\n${colors.green}First 2 requests (below threshold):${colors.reset}`
  );
  console.log(`  Average: ${avgFast.toFixed(0)}ms`);
  console.log(
    `\n${colors.yellow}Remaining requests (with backoff):${colors.reset}`
  );
  console.log(`  Average: ${avgSlow.toFixed(0)}ms`);

  // Verify backoff is working
  const backoffWorking = avgSlow > avgFast + 100; // Should be noticeably slower
  const statusIcon = backoffWorking ? "✓" : "✗";
  const statusColor = backoffWorking ? colors.green : colors.red;

  console.log(
    `\n${statusColor}Rate limiting backoff: ${statusIcon} ${
      backoffWorking ? "WORKING" : "NOT DETECTED"
    }${colors.reset}`
  );

  if (backoffWorking) {
    console.log(
      `${colors.green}Requests slowed down by ~${(avgSlow - avgFast).toFixed(
        0
      )}ms on average due to backoff${colors.reset}`
    );
  }

  console.log(
    `\n${colors.magenta}========================================${colors.reset}\n`
  );
}

// Run the tests
async function runAllTests() {
  const args = process.argv.slice(2);

  if (args.includes("--rate-limit") || args.includes("-r")) {
    await testRateLimiting();
  } else if (args.includes("--cache") || args.includes("-c")) {
    await testCaching();
  } else if (args.includes("--all") || args.includes("-a")) {
    await testCaching();
    await testRateLimiting();
  } else {
    // Default: run rate limiting test
    console.log(
      `${colors.blue}Usage: ts-node test_harness.ts [--cache|-c] [--rate-limit|-r] [--all|-a]${colors.reset}\n`
    );
    await testRateLimiting();
  }
}

runAllTests().catch(console.error);
