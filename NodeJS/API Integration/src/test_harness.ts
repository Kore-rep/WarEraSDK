import { createAPI } from "./client";
import { performance } from "perf_hooks";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

interface TestResult {
  endpoint: string;
  firstCallTime: number;
  secondCallTime: number;
  speedup: number;
  cacheHit: boolean;
}

async function testCaching(cache: null | undefined) {
  console.log(`${colors.cyan}========================================`);
  console.log("SDK Cache Performance Test");
  console.log(`========================================${colors.reset}\n`);

  const cachingEnabled = cache !== null;

  console.log(
    `${colors.blue}Test: ${
      cachingEnabled ? "CACHE ENABLED" : "CACHE DISABLED"
    }${colors.reset}`
  );

  // Create API instance with desired caching mode
  const api = await createAPI(
    {
      baseUrl: "https://api2.warera.io/trpc",
      cacheTTL: 300000, // only applies if caching enabled
    },
    cache
  );

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
      var res1 = await test.call();
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
      var res2 = await test.call();
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
      if (res1 !== res2) {
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

// Run the test
testCaching(null).catch(console.error);
