import axios from "axios";
import { createAPI } from "../client";
import { CacheProvider } from "../cache/cacheProvider";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

/** Simple in-memory provider recording gets/sets for assertions. */
class RecordingCache implements CacheProvider {
  store = new Map<string, unknown>();
  gets: string[] = [];
  sets: { key: string; ttl?: number }[] = [];

  async get<T>(key: string): Promise<T | undefined> {
    this.gets.push(key);
    return this.store.get(key) as T | undefined;
  }
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.sets.push({ key, ttl });
    this.store.set(key, value);
  }
  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
  async clear(): Promise<void> {
    this.store.clear();
  }
}

const baseUrl = "https://api.test";

describe("per-request cache options", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it("caches by default and serves the second call from cache", async () => {
    const cache = new RecordingCache();
    const api = createAPI({ baseUrl, cache });
    mockedAxios.get.mockResolvedValue({ data: { result: { data: { _id: "u1" } } } });

    await api.user.getUserLite("u1");
    await api.user.getUserLite("u1");

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(cache.sets).toHaveLength(1);
  });

  it("honors a custom ttl on endpoints that previously had no options", async () => {
    const cache = new RecordingCache();
    const api = createAPI({ baseUrl, cache });
    mockedAxios.get.mockResolvedValue({ data: { result: { data: { name: "MU" } } } });

    await api.mu.getById("m1", { cache: { ttl: 6 * 3600 * 1000 } });

    expect(cache.sets).toEqual([expect.objectContaining({ ttl: 6 * 3600 * 1000 })]);
  });

  it("enabled:false bypasses the cache entirely (no read, no write)", async () => {
    const cache = new RecordingCache();
    const api = createAPI({ baseUrl, cache });
    mockedAxios.get.mockResolvedValue({ data: { result: { data: { items: [] } } } });

    await api.company.getCompanies({ userId: "u1" }, { cache: { enabled: false } });
    await api.company.getCompanies({ userId: "u1" }, { cache: { enabled: false } });

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(cache.gets).toHaveLength(0);
    expect(cache.sets).toHaveLength(0);
  });

  it("batch mode: enabled:false calls skip the cache pre-check and are not stored", async () => {
    const cache = new RecordingCache();
    const api = createAPI({ baseUrl, cache, batch: true });

    // Seed the cache as if a previous fetch stored this user.
    cache.store.set('user.getUserLite:{"userId":"u1"}', { result: { data: { _id: "stale" } } });

    mockedAxios.get.mockResolvedValue({
      data: [{ result: { data: { _id: "fresh" } } }],
    });

    const promise = api.user.getUserLite("u1", { cache: { enabled: false } });
    await api.runBatch();
    const result = (await promise) as { result: { data: { _id: string } } };

    // Went to the network despite the seeded cache entry, and did not overwrite it.
    expect(result.result.data._id).toBe("fresh");
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(cache.sets).toHaveLength(0);
  });

  it("batch mode: cached calls still resolve from cache by default", async () => {
    const cache = new RecordingCache();
    const api = createAPI({ baseUrl, cache, batch: true });
    cache.store.set('user.getUserLite:{"userId":"u1"}', { result: { data: { _id: "cached" } } });

    const promise = api.user.getUserLite("u1");
    await api.runBatch();
    const result = (await promise) as { result: { data: { _id: string } } };

    expect(result.result.data._id).toBe("cached");
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});
