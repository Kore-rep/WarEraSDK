# API Integration SDK — README

## Project goal

This package aims to provide a small, well-documented Node.js SDK that makes it seamless to call the game API. The SDK should:

- Expose simple, composable functions for every (or most) GET endpoints in the API.
- Handle common client concerns: base URL configuration, auth headers, pagination helpers, retries/backoff, error normalization.
- Provide clear examples so consumers can get started quickly in Node.

## Type system & project type

This project is implemented with TypeScript and uses strict compiler settings. All endpoints, request parameters, responses and the batching helpers will be strongly typed. The SDK will expose TypeScript types (for example an `EndpointMap` and resource-specific types) so consumers get full compile-time safety when calling `client.*` methods. The repository is a strict TypeScript project (expect a `tsconfig.json` with `strict: true`) and all new endpoint functions and request helpers should include types in their public signatures.

## Contract (high level)

- Inputs: configuration object (baseUrl, global timeout, retry options), endpoint-specific parameters (path params, query params).
- Outputs: a normalized JS object on success, or a thrown error with structured fields on failure: { message, status, code?, details? }.
- Error modes: network errors, non-2xx responses, malformed responses. SDK will expose consistent error shapes to simplify handling.

Note on typing: all interfaces above (inputs/outputs/errors) will be represented as TypeScript types or interfaces. Endpoint implementations should use generics driven by a central `EndpointMap` so each `request`/`batch` call returns the correctly typed result.

## Key features / success criteria

- Minimal, clear API surface for each endpoint: e.g. `api.company.getById(id)` or `api.battle.getBattles()`.
- Automatic JSON parsing and basic validation (e.g. non-empty response where appropriate).
- Configurable retry/backoff strategy for transient failures.
- Lightweight: no heavy runtime dependencies unless necessary; compatible with Node.js LTS.

## Endpoints (mapped from Postman screenshot)

The SDK should cover (at minimum) these endpoints grouped by resource:

- company: `company.getById`, `company.getCompanies`
- country: `country.getCountryById`, `country.getAllCountries`
- government: `government.getByCountryId`
- region: `region.getById`, `region.getRegionsObject`
- battle: `battle.getById`, `battle.getLiveBattleData`, `battle.getBattles`
- round: `round.getById`, `round.getLastHits`
- battleRanking: `battleRanking.getRanking`
- itemTrading: `itemTrading.getPrices`
- tradingOrder: `tradingOrder.getTopOrders`
- itemOffer: `itemOffer.getById`
- workOffer: `workOffer.getById`, `workOffer.getWorkOfferByCompanyId`, `workOffer.getWorkOffersPaginated`
- ranking: `ranking.getRanking`
- search: `search.searchAnything`
- gameConfig: `gameConfig.getDates`, `gameConfig.getGameConfig`
- user: `user.getUserLite`, `user.getUsersByCountry`
- article: `article.getArticleById`, `article.getArticlesPaginated`
- mu: `mu.getById`, `mu.getManyPaginated`
- transaction: `transaction.getPaginatedTransactions`
- upgrade: `upgrade.getUpgradeByTypeAndEntity`

(Implementation note: map each named request to a function under the relevant resource namespace.)

## Batch requests & request-builder (server quirk)

This API has a helpful — but unique — batching quirk: you can combine multiple named GET endpoints into a single HTTP GET by joining the function names with commas and passing a single `input` JSON object where each entry is keyed by the numeric index of the function in the list. When batching, add `batch=1` to the query string. The backend will route each numeric input object to the corresponding function by order.

Examples:

- Single call (no batch):

  {{baseUrl}}/government.getByCountryId?input={"countryId":"6813b6d546e731854c7ac85c"}

- Single call (country):

  {{baseUrl}}/country.getCountryById?input={"countryId":"6813b6d546e731854c7ac85c"}

- Batched call (country then government):

  {{baseUrl}}/country.getCountryById,government.getByCountryId?input={"0":{"countryId":"6813b6d546e731854c7ac85c"},"1":{"countryId":"6813b6d546e731854c7ac85c"}}&batch=1

Breakdown and rules:

- Function order matters: the backend maps numeric keys (0, 1, 2, ...) in the `input` JSON to the corresponding function in the comma-separated list.
- All requests are GETs and parameters are passed in the URL as a JSON-encoded `input` query parameter.
- Add `batch=1` to indicate a batched request.
- Keep batches reasonably small to avoid overly long URLs; if you expect large payloads consider splitting or asking the backend for a POST alternative.

How to support this in the SDK

Strategy goals:

- Keep the public API ergonomic: allow both single-call usage (e.g., `client.country.getCountryById(...)`) and batched usage (explicit or automatic grouping).
- Preserve type safety: when using TypeScript, the request builder should use generics and a central `EndpointMap` so each call returns the correct typed result.
- Make batching explicit (recommended) or provide an opt-in collection mode to auto-batch multiple calls made in a short window (advanced).

API surface suggestions

- client.request(endpointName, params) -> Promise<ResponseType>
- client.batch(calls: Array<{ name: EndpointName, params: Params }>) -> Promise<Array<ResponseType>>
- client.group(async (batch) => { /* use batch.* methods which queue up calls and then execute as a single batched request */ })

TypeScript generics sketch

Create a central mapping of endpoints to their parameter and response types. This drives the request-builder types.

```ts
type EndpointMap = {
  'country.getCountryById': { params: { countryId: string }; response: Country };
  'government.getByCountryId': { params: { countryId: string }; response: Government };
  // ...other endpoints
};

type EndpointName = keyof EndpointMap;

function request<K extends EndpointName>(name: K, params: EndpointMap[K]['params']): Promise<EndpointMap[K]['response']> {
  // implementation delegates to low-level fetcher
}

// batch accepts a typed list and returns typed results in the same order
function batch<T extends EndpointName[]>(calls: { [I in keyof T]: { name: T[I]; params: EndpointMap[T[I]]['params'] } }): Promise<{ [I in keyof T]: EndpointMap[T[I]]['response'] }> {
  // build URL like: `${baseUrl}/${funcs}?input=${encodedInput}&batch=1`
}
```

Batch URL builder (implementation detail)

1. Collect ordered function names: ['country.getCountryById', 'government.getByCountryId'] -> `country.getCountryById,government.getByCountryId`
2. Build an input object whose keys are numeric indexes (0,1,2...) mapping to each call's params:

```js
const inputObj = {};
calls.forEach((c, i) => { inputObj[i] = c.params; });
const url = `${baseUrl}/${funcs}?input=${encodeURIComponent(JSON.stringify(inputObj))}&batch=1`;
```

3. Perform GET on the URL and parse the array/object response; map positional results back to callers.

Practical SDK patterns

- Explicit batch API (recommended):

```ts
const results = await client.batch([
  { name: 'country.getCountryById', params: { countryId } },
  { name: 'government.getByCountryId', params: { countryId } }
]);

const countryResult = results[0] as Country;
const governmentResult = results[1] as Government;
```

- Grouped builder (convenience):

```ts
await client.group(async (b) => {
  const countryP = b.request('country.getCountryById', { countryId });
  const govP = b.request('government.getByCountryId', { countryId });
  // the builder queues both and executes a single batched request
  const [country, government] = await Promise.all([countryP, govP]);
});
```

Notes & caveats

- URL length: JSON-encoded `input` can become long. Monitor and limit batch size accordingly.
- Error mapping: the backend may return per-call results with errors—normalize per-call error shapes and reject/resolve each promise appropriately.
- Order guarantees: results are returned in the same order as the function names, so maintain positional mapping.
- Testing: add unit tests for the batch URL builder, positional mapping, error propagation, and type contract correctness.

## Usage examples

Minimal example using `axios`.

### Node example (native fetch)

```js
// Create a client (example API)
import Api from '../API Integration'; // planned path for SDK factory, subject to change

const client = createAPI({
  //baseUrl: 'https://api.example.com' // baseUrl will be built-in, but can point to a new url if needed
});

async function main() {
  // simple call
  const company = await client.company.getById('1234');
  console.log('company', company);

  // paginated example
  const battles = await client.battle.getBattles({ page: 1, limit: 50 });
  console.log('battles', battles.items.length);
}

main().catch(err => {
  console.error('Request failed', err);
});
```

## Design notes / recommended internals

- Factory API: `createAPI(config)` returns an object with namespaced resources. This keeps construction and dependency injection easy.
- Request layer: single `request(path, { method, params, headers, body })` used by all endpoint functions.
- Error normalization: wrap non-2xx and network errors into a typed `ApiError` with `status`, `message`, `payload`.
- Retry/backoff: configurable; default to small exponential backoff for idempotent GETs.
- Pluggable fetcher: allow passing `axios`/custom to support different environments and testing.

## Edge cases & checks

- Empty responses or unexpected shapes — surface a clear error.
- Rate limiting — detect 429 and surface to caller; optionally support `retryAfter` handling.
- Large result sets — avoid auto-fetching everything unless explicitly requested.
- Timeouts — abort requests using AbortController or axios timeout.

## Testing & quality gates

- Unit tests for request normalization, pagination helpers, error mapping.
- Integration tests (optional) against a staging instance or mocked HTTP server.
- Linting with ESLint and TypeScript (if used) recommended.

## Next steps (implementation roadmap)

1. Create `createAPI(config)` factory and a single request wrapper.
2. Implement a few core endpoints (e.g., `company.getById`, `battle.getBattles`, `user.getUserLite`) as examples.
3. Add retries and configurable fetcher.
4. Expand to cover rest of endpoints, add TypeScript types, and publish package.
5. Implement Unit tests to ensure endpoints and API Works as intended

## Contributing

- Keep functions small and single-purpose.
- Add unit tests when adding logic (pagination, retries, parsing).
- Create basic functions, the developer(s) will comb through each to ensure they are correctly set up.

## Files / structure (suggested)

- `src/client.ts` — factory and client bootstrap
- `src/request.ts` — low-level HTTP wrapper
- `src/resources/*.ts` — per-resource modules (company.ts, battle.ts, user.ts)
- `test/` — unit and integration tests
