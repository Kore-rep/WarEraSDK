# WarEra SDK

A TypeScript SDK for the WarEra game API with built-in caching, request batching, and rate limiting support.

## Installation

```bash
npm install warera-sdk
```

## Quick Start

```typescript
import { createAPI } from 'warera-sdk';

const api = createAPI({
  baseUrl: 'https://api.warera.io/trpc',
});

// Make requests
const countries = await api.country.getAllCountries();
const user = await api.user.getUserLite('userId123');
const company = await api.company.getById({ id: 'companyId' });
```

## Configuration

```typescript
import { createAPI } from 'warera-sdk';

const api = createAPI({
  // Base URL for API requests
  baseUrl: 'https://api.warera.io/trpc',
  
  // Optional API key for authentication (sent as X-API-Key header)
  apiKey: 'your-api-key',
  
  // Enable batch mode for grouping requests
  batch: false,
  
  // Cache configuration
  cache: undefined,  // undefined = in-memory cache (default)
                     // null = disable caching
                     // CacheProvider = custom cache implementation
  
  // Cache TTL in milliseconds (default: 30000)
  cacheTTL: 30000,
  
  // Rate limiting (optional)
  rateLimit: {
    maxRequests: 100,      // Max requests per window
    windowMs: 60000,       // Window size in ms (1 minute)
    backoffThreshold: 0.7, // Start slowing at 70% of limit
    maxBackoffMs: 5000,    // Max delay when at limit
    throwOnLimit: false,   // Wait instead of throwing
  },
});
```

## Features

### API Key Authentication

If your API requires authentication, you can provide an API key that will be sent with every request as the `X-API-Key` header:

```typescript
const api = createAPI({
  baseUrl: 'https://api.warera.io/trpc',
  apiKey: process.env.WARERA_API_KEY,
});

// All requests will now include the X-API-Key header
const user = await api.user.getUserLite('userId123');
```

### Caching

The SDK includes built-in caching. By default, an in-memory cache is used.

```typescript
// Default in-memory cache
const api = createAPI({ baseUrl: '...' });

// Disable caching
const api = createAPI({ 
  baseUrl: '...',
  cache: null 
});

// Custom cache provider
import { CacheProvider } from 'warera-sdk';

class RedisCache implements CacheProvider {
  async get<T>(key: string): Promise<T | undefined> { /* ... */ }
  async set(key: string, value: unknown, ttl?: number): Promise<void> { /* ... */ }
  async del(key: string): Promise<void> { /* ... */ }
}

const api = createAPI({ 
  baseUrl: '...',
  cache: new RedisCache() 
});
```

### Rate Limiting

Built-in client-side rate limiting with gradual backoff:

```typescript
const api = createAPI({
  baseUrl: '...',
  rateLimit: {
    maxRequests: 50,        // 50 requests
    windowMs: 30000,        // per 30 seconds
    backoffThreshold: 0.8,  // start slowing at 80%
    maxBackoffMs: 3000,     // max 3s delay
    throwOnLimit: false,    // wait instead of throwing error
  },
});

// Check current rate limit status
const status = api.getRateLimitStatus();
// { requestCount: 45, maxRequests: 50, usagePercent: 90, isAtLimit: false, currentBackoffMs: 450 }
```

### Request Batching

Combine multiple requests into a single HTTP call:

```typescript
const api = createAPI({ 
  baseUrl: '...',
  batch: true 
});

// Queue up requests
const countryPromise = api.country.getAllCountries();
const configPromise = api.gameConfig.getGameConfig();

// Execute all queued requests in a single batch
const results = await api.runBatch();

// Or clear the queue without executing
api.clearBatch();
```

### Cache Invalidation

```typescript
// Invalidate a specific cached endpoint
await api.invalidateCache('user.getUserLite', { userId: '123' });
```

## Available Resources

| Resource | Methods |
|----------|---------|
| `company` | `getById`, `getCompanies` |
| `country` | `getCountryById`, `getAllCountries` |
| `government` | `getByCountryId` |
| `region` | `getById`, `getRegionsObject` |
| `battle` | `getById`, `getLiveBattleData`, `getBattles` |
| `round` | `getById`, `getLastHits` |
| `battleRanking` | `getRanking` |
| `itemTrading` | `getPrices` |
| `tradingOrder` | `getTopOrders` |
| `itemOffer` | `getById` |
| `workOffer` | `getById`, `getWorkOfferByCompanyId`, `getWorkOffersPaginated` |
| `ranking` | `getRanking` |
| `search` | `searchAnything` |
| `gameConfig` | `getDates`, `getGameConfig` |
| `user` | `getUserLite`, `getUsersByCountry` |
| `article` | `getArticleById`, `getArticlesPaginated` |
| `message` | `getMessagesByArticleId` |
| `mu` | `getById`, `getManyPaginated` |
| `transaction` | `getPaginatedTransactions` |
| `upgrade` | `getUpgradeByTypeAndEntity` |

## TypeScript Support

The SDK is written in TypeScript and exports all types:

```typescript
import { 
  createAPI,
  APIClient,
  APIConfig,
  CacheProvider,
  RateLimitConfig,
  ApiError,
  // Response types
  GetUserLiteResponse,
  GetCompanyByIdResponse,
  // ...and more
} from 'warera-sdk';
```

## Error Handling

```typescript
import { ApiError } from 'warera-sdk';

try {
  const user = await api.user.getUserLite('invalidId');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Details:', error.details);
  }
}
```

## Rate Limit Errors

```typescript
import { RateLimitError } from 'warera-sdk';

const api = createAPI({
  baseUrl: '...',
  rateLimit: {
    maxRequests: 10,
    windowMs: 60000,
    throwOnLimit: true, // Throw instead of waiting
  },
});

try {
  // Make many requests...
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error('Rate limited! Retry after:', error.retryAfterMs, 'ms');
  }
}
```

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 4.7 (for TypeScript users)

## License

MIT
