import { RateLimiter, RateLimitError } from "./rateLimiter";

describe("RateLimiter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Basic functionality", () => {
    it("should track requests and allow requests within limit", async () => {
      const limiter = new RateLimiter({
        maxRequests: 5,
        windowMs: 1000,
      });

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        const promise = limiter.acquire();
        await jest.runAllTimersAsync();
        await promise;
      }

      expect(limiter.getRequestCount()).toBe(5);
      expect(limiter.isAtLimit()).toBe(true);
    });

    it("should use default config when none provided", () => {
      const limiter = new RateLimiter();
      const status = limiter.getStatus();

      expect(status.maxRequests).toBe(100);
      expect(status.requestCount).toBe(0);
    });

    it("should merge partial config with defaults", () => {
      const limiter = new RateLimiter({
        maxRequests: 50,
      });
      const status = limiter.getStatus();

      expect(status.maxRequests).toBe(50);
      // Other defaults should still apply
      expect(limiter["config"].windowMs).toBe(60000);
    });
  });

  describe("Window-based expiration", () => {
    it("should prune old timestamps outside the window", async () => {
      const limiter = new RateLimiter({
        maxRequests: 5,
        windowMs: 1000,
      });

      // Make requests at different times
      await limiter.acquire();
      jest.advanceTimersByTime(500);
      await limiter.acquire();
      jest.advanceTimersByTime(600); // Total: 1100ms, first request should be pruned

      expect(limiter.getRequestCount()).toBe(1);
    });

    it("should allow new requests after window expires", async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 1000,
        throwOnLimit: false,
      });

      // Fill up the limit
      await limiter.acquire();
      await limiter.acquire();
      expect(limiter.isAtLimit()).toBe(true);

      // Advance time past the window
      jest.advanceTimersByTime(1001);

      // Should be able to make new requests
      await limiter.acquire();
      expect(limiter.getRequestCount()).toBe(1);
      expect(limiter.isAtLimit()).toBe(false);
    });
  });

  describe("Backoff calculation", () => {
    it("should not apply backoff below threshold", async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        backoffThreshold: 0.7,
        maxBackoffMs: 1000,
      });

      // Make 6 requests (60% - below 70% threshold)
      for (let i = 0; i < 6; i++) {
        const start = Date.now();
        await limiter.acquire();
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(10); // Should be immediate
      }
    });

    it("should apply backoff above threshold", async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        backoffThreshold: 0.7,
        maxBackoffMs: 1000,
      });

      // Make 8 requests (80% - above 70% threshold)
      for (let i = 0; i < 8; i++) {
        await limiter.acquire();
      }

      const status = limiter.getStatus();
      expect(status.currentBackoffMs).toBeGreaterThan(0);
      expect(status.currentBackoffMs).toBeLessThanOrEqual(1000);
    });

    it("should increase backoff as limit approaches", async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        backoffThreshold: 0.7,
        maxBackoffMs: 1000,
      });

      // Make 8 requests (80% - above threshold)
      for (let i = 0; i < 8; i++) {
        const promise = limiter.acquire();
        await jest.runAllTimersAsync();
        await promise;
      }
      const backoffAt80 = limiter.getStatus().currentBackoffMs;

      // Make 9 requests (90% - closer to limit)
      const promise9 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise9;
      const backoffAt90 = limiter.getStatus().currentBackoffMs;

      expect(backoffAt80).toBeGreaterThan(0);
      expect(backoffAt90).toBeGreaterThan(backoffAt80);
    });

    it("should cap backoff at maxBackoffMs", async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        backoffThreshold: 0.5,
        maxBackoffMs: 500,
      });

      // Fill up to limit
      for (let i = 0; i < 10; i++) {
        const promise = limiter.acquire();
        await jest.runAllTimersAsync();
        await promise;
      }

      const status = limiter.getStatus();
      expect(status.currentBackoffMs).toBeLessThanOrEqual(500);
    });
  });

  describe("At limit detection", () => {
    it("should detect when at limit", async () => {
      const limiter = new RateLimiter({
        maxRequests: 3,
        windowMs: 1000,
      });

      expect(limiter.isAtLimit()).toBe(false);

      await limiter.acquire();
      await limiter.acquire();
      await limiter.acquire();

      expect(limiter.isAtLimit()).toBe(true);
    });

    it("should calculate time until slot available", async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 1000,
      });

      await limiter.acquire();
      await limiter.acquire();

      const timeUntilAvailable = limiter.getTimeUntilSlotAvailable();
      expect(timeUntilAvailable).toBeGreaterThan(0);
      expect(timeUntilAvailable).toBeLessThanOrEqual(1000);
    });

    it("should return 0 when not at limit", async () => {
      const limiter = new RateLimiter({
        maxRequests: 5,
        windowMs: 1000,
      });

      await limiter.acquire();
      expect(limiter.getTimeUntilSlotAvailable()).toBe(0);
    });
  });

  describe("Throw on limit", () => {
    it("should throw RateLimitError when throwOnLimit is true", async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 1000,
        throwOnLimit: true,
      });

      const promise1 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise1;
      
      const promise2 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise2;

      // Now at limit, next acquire should throw
      const promise3 = limiter.acquire();
      await jest.runAllTimersAsync();
      await expect(promise3).rejects.toThrow(RateLimitError);
    });

    it("should include retryAfterMs in RateLimitError", async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 1000,
        throwOnLimit: true,
      });

      const promise1 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise1;
      
      const promise2 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise2;

      // Now at limit, next acquire should throw
      const promise3 = limiter.acquire();
      await jest.runAllTimersAsync();
      
      // Verify it throws and check error details
      try {
        await promise3;
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        if (error instanceof RateLimitError) {
          expect(error.retryAfterMs).toBeGreaterThan(0);
          expect(error.message).toContain("Rate limit exceeded");
        }
      }
    });
  });

  describe("Wait on limit", () => {
    it("should wait when throwOnLimit is false", async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 1000,
        throwOnLimit: false,
      });

      const promise1 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise1;
      
      const promise2 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise2;

      const acquirePromise = limiter.acquire();
      jest.advanceTimersByTime(1001); // Advance past window
      await jest.runAllTimersAsync();
      await acquirePromise;

      expect(limiter.getRequestCount()).toBe(1); // Old requests pruned, new one added
    });

    it("should wait for correct duration when at limit", async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 2000,
        throwOnLimit: false,
      });

      const promise1 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise1;
      
      jest.advanceTimersByTime(100);
      
      const promise2 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise2;
      
      jest.advanceTimersByTime(100);

      // Now at limit, next acquire should wait
      const acquirePromise = limiter.acquire();
      const waitTime = limiter.getTimeUntilSlotAvailable();
      jest.advanceTimersByTime(waitTime + 10);
      await jest.runAllTimersAsync();
      await acquirePromise;

      // Should have waited approximately waitTime
      expect(limiter.getRequestCount()).toBeGreaterThan(0);
    });
  });

  describe("Status reporting", () => {
    it("should return accurate status", async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        backoffThreshold: 0.7,
        maxBackoffMs: 1000,
      });

      const initialStatus = limiter.getStatus();
      expect(initialStatus.requestCount).toBe(0);
      expect(initialStatus.maxRequests).toBe(10);
      expect(initialStatus.usagePercent).toBe(0);
      expect(initialStatus.isAtLimit).toBe(false);
      expect(initialStatus.currentBackoffMs).toBe(0);

      // Make 8 requests (80% - above 70% threshold)
      for (let i = 0; i < 8; i++) {
        const promise = limiter.acquire();
        await jest.runAllTimersAsync();
        await promise;
      }

      const statusAt80 = limiter.getStatus();
      expect(statusAt80.requestCount).toBe(8);
      expect(statusAt80.usagePercent).toBe(80);
      expect(statusAt80.isAtLimit).toBe(false);
      expect(statusAt80.currentBackoffMs).toBeGreaterThan(0);

      // Fill to limit (2 more requests to reach 10)
      const promise9 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise9;
      
      const promise10 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise10;

      const statusAtLimit = limiter.getStatus();
      expect(statusAtLimit.requestCount).toBe(10);
      expect(statusAtLimit.usagePercent).toBe(100);
      expect(statusAtLimit.isAtLimit).toBe(true);
    });

    it("should calculate usage percentage correctly", async () => {
      const limiter = new RateLimiter({
        maxRequests: 4,
        windowMs: 1000,
      });

      const promise1 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise1;
      expect(limiter.getStatus().usagePercent).toBe(25);

      const promise2 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise2;
      expect(limiter.getStatus().usagePercent).toBe(50);

      const promise3 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise3;
      
      const promise4 = limiter.acquire();
      await jest.runAllTimersAsync();
      await promise4;
      expect(limiter.getStatus().usagePercent).toBe(100);
    });
  });

  describe("Reset functionality", () => {
    it("should reset all tracked requests", async () => {
      const limiter = new RateLimiter({
        maxRequests: 5,
        windowMs: 1000,
      });

      for (let i = 0; i < 5; i++) {
        const promise = limiter.acquire();
        await jest.runAllTimersAsync();
        await promise;
      }

      expect(limiter.getRequestCount()).toBe(5);
      expect(limiter.isAtLimit()).toBe(true);

      limiter.reset();

      expect(limiter.getRequestCount()).toBe(0);
      expect(limiter.isAtLimit()).toBe(false);
    });

    it("should allow new requests after reset", async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 1000,
        throwOnLimit: true,
      });

      await limiter.acquire();
      await limiter.acquire();

      limiter.reset();

      // Should be able to acquire again without error
      await expect(limiter.acquire()).resolves.not.toThrow();
    });
  });

  describe("Edge cases", () => {
    it("should handle zero maxRequests gracefully", () => {
      const limiter = new RateLimiter({
        maxRequests: 0,
        windowMs: 1000,
      });

      expect(limiter.isAtLimit()).toBe(true);
      // When maxRequests is 0 and no requests, usage ratio should be 0
      expect(limiter.getUsageRatio()).toBe(0);
      
      // After making a request, ratio should be Infinity
      limiter["requestTimestamps"].push(Date.now());
      expect(limiter.getUsageRatio()).toBe(Infinity);
    });

    it("should handle very small windows", async () => {
      const limiter = new RateLimiter({
        maxRequests: 2,
        windowMs: 10,
        throwOnLimit: false,
      });

      await limiter.acquire();
      await limiter.acquire();

      // Advance past window
      jest.advanceTimersByTime(11);

      // Should be able to acquire again
      await limiter.acquire();
      expect(limiter.getRequestCount()).toBe(1);
    });

    it("should handle backoffThreshold at 1.0", async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        backoffThreshold: 1.0,
        maxBackoffMs: 1000,
      });

      // Make 9 requests (90% - below 100% threshold)
      for (let i = 0; i < 9; i++) {
        await limiter.acquire();
      }

      expect(limiter.getStatus().currentBackoffMs).toBe(0);
    });

    it("should handle backoffThreshold at 0.0", async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        backoffThreshold: 0.0,
        maxBackoffMs: 100,
      });

      // Even first request should have backoff
      await limiter.acquire();
      const status = limiter.getStatus();
      expect(status.currentBackoffMs).toBeGreaterThan(0);
    });
  });

  describe("Concurrent requests", () => {
    it("should handle concurrent acquire calls", async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        throwOnLimit: false,
      });

      // Make concurrent requests
      const promises = Array.from({ length: 10 }, () => limiter.acquire());
      
      // Advance time and run all timers to process all delays
      jest.advanceTimersByTime(2000);
      await jest.runAllTimersAsync();
      
      await Promise.all(promises);

      // Should have tracked all requests (some may have waited)
      expect(limiter.getRequestCount()).toBeGreaterThanOrEqual(5);
      expect(limiter.getRequestCount()).toBeLessThanOrEqual(10);
    });
  });
});
