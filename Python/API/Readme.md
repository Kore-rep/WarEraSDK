# API Integration SDK — README

## Project goal

This package aims to provide a small, well-documented Python SDK that makes it seamless to call the game API. The SDK should:

- Expose simple, composable functions for every (or most) GET endpoints in the API.
- Handle common client concerns: base URL configuration, auth headers, pagination helpers, retries/backoff, error normalization.
- Provide clear examples so consumers can get started quickly in Python.

## Type system & project type

This project is implemented with Python 3.8+ and uses type hints throughout. All endpoints, request parameters, responses and the batching helpers will be strongly typed using Python's type system (typing module, dataclasses, Pydantic models, etc.). The SDK will expose clear type definitions so consumers get full IDE support and type checking when calling `client.*` methods. The repository uses type hints and can be validated with mypy or similar type checkers.

## Contract (high level)

- Inputs: configuration object (base_url, global timeout, retry options), endpoint-specific parameters (path params, query params).
- Outputs: a normalized Python dict/object on success, or a raised exception with structured fields on failure: { message, status, code?, details? }.
- Error modes: network errors, non-2xx responses, malformed responses. SDK will expose consistent error shapes to simplify handling.

Note on typing: all interfaces above (inputs/outputs/errors) will be represented as Python type hints, dataclasses, or Pydantic models. Endpoint implementations should use TypedDict or Protocol types so each `request`/`batch` call returns the correctly typed result.

## Key features / success criteria

- Minimal, clear API surface for each endpoint: e.g. `api.company.get_by_id(id)` or `api.battle.get_battles()`.
- Automatic JSON parsing and basic validation (e.g. non-empty response where appropriate).
- Configurable retry/backoff strategy for transient failures.
- Lightweight: minimal dependencies (requests/httpx); compatible with Python 3.8+.

## Endpoints

The SDK should cover (at minimum) these endpoints grouped by resource:

- ⬜ company: `company.get_by_id`, `company.get_companies`
- ⬜ country: `country.get_country_by_id`, `country.get_all_countries`
- ⬜ government: `government.get_by_country_id`
- ⬜ region: `region.get_by_id`, `region.get_regions_object`
- ⬜ battle: `battle.get_by_id`, `battle.get_live_battle_data`, `battle.get_battles`
- ⬜ round: `round.get_by_id`, `round.get_last_hits`
- ⬜ battle_ranking: `battle_ranking.get_ranking`
- ⬜ item_trading: `item_trading.get_prices`
- ⬜ trading_order: `trading_order.get_top_orders`
- ⬜ item_offer: `item_offer.get_by_id`
- ⬜ work_offer: `work_offer.get_by_id`, `work_offer.get_work_offer_by_company_id`, `work_offer.get_work_offers_paginated`
- ⬜ ranking: `ranking.get_ranking`
- ⬜ search: `search.search_anything`
- ⬜ game_config: `game_config.get_dates`, `game_config.get_game_config`
- ⬜ user: `user.get_user_lite`, `user.get_users_by_country`
- ⬜ article: `article.get_article_by_id`, `article.get_articles_paginated`
- ⬜ message: `message.get_messages_by_article_id`
- ⬜ mu: `mu.get_by_id`, `mu.get_many_paginated`
- ⬜ transaction: `transaction.get_paginated_transactions`
- ⬜ upgrade: `upgrade.get_upgrade_by_type_and_entity`

(Implementation note: map each named request to a method under the relevant resource namespace.)

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

- Keep the public API ergonomic: allow both single-call usage (e.g., `client.country.get_country_by_id(...)`) and batched usage (explicit or automatic grouping).
- Preserve type safety: when using type hints, the request builder should use generics and protocols so each call returns the correct typed result.
- Make batching explicit (recommended) or provide an opt-in collection mode to auto-batch multiple calls made in a short window (advanced).

API surface suggestions

- `client.request(endpoint_name, params)` -> Response
- `client.batch(calls: List[Dict])` -> List[Response]
- `client.batch_context()` -> context manager that queues calls and executes as batch

TypeScript generics sketch (adapted for Python)

Create a central mapping of endpoints to their parameter and response types using TypedDict or Protocols.

```python
from typing import TypedDict, Protocol, Union, List
from dataclasses import dataclass

class CountryParams(TypedDict):
    country_id: str

class GovernmentParams(TypedDict):
    country_id: str

@dataclass
class Country:
    id: str
    name: str
    # ... other fields

@dataclass
class Government:
    country_id: str
    # ... other fields

class EndpointConfig(Protocol):
    params: TypedDict
    response: type

# Endpoint registry for type mapping
ENDPOINT_MAP = {
    'country.getCountryById': {
        'params': CountryParams,
        'response': Country
    },
    'government.getByCountryId': {
        'params': GovernmentParams,
        'response': Government
    },
    # ... other endpoints
}

def request(endpoint_name: str, params: dict) -> dict:
    """Make a single API request"""
    # implementation delegates to low-level fetcher
    pass

def batch(calls: List[dict]) -> List[dict]:
    """Execute multiple calls in a single batched request"""
    # build URL like: `${base_url}/${funcs}?input=${encoded_input}&batch=1`
    pass
```

Batch URL builder (implementation detail)

1. Collect ordered function names: ['country.getCountryById', 'government.getByCountryId'] -> `country.getCountryById,government.getByCountryId`
2. Build an input object whose keys are numeric indexes (0,1,2...) mapping to each call's params:

```python
import json
from urllib.parse import urlencode

input_obj = {}
for i, call in enumerate(calls):
    input_obj[str(i)] = call['params']

funcs = ','.join(call['name'] for call in calls)
params = {
    'input': json.dumps(input_obj),
    'batch': '1'
}
url = f"{base_url}/{funcs}?{urlencode(params, safe=':,{}[]')}"
```

3. Perform GET on the URL and parse the array/object response; map positional results back to callers.

Practical SDK patterns

- Explicit batch API (recommended):

```python
results = client.batch([
    {'name': 'country.getCountryById', 'params': {'countryId': country_id}},
    {'name': 'government.getByCountryId', 'params': {'countryId': country_id}}
])

country_result = results[0]  # typed as Country
government_result = results[1]  # typed as Government
```

- Context manager builder (convenience):

```python
with client.batch_context() as batch:
    country_future = batch.request('country.getCountryById', {'countryId': country_id})
    gov_future = batch.request('government.getByCountryId', {'countryId': country_id})
    # context manager queues both and executes a single batched request on exit

country = country_future.result()
government = gov_future.result()
```

Notes & caveats

- URL length: JSON-encoded `input` can become long. Monitor and limit batch size accordingly.
- Error mapping: the backend may return per-call results with errors—normalize per-call error shapes and raise/return each appropriately.
- Order guarantees: results are returned in the same order as the function names, so maintain positional mapping.
- Testing: add unit tests for the batch URL builder, positional mapping, error propagation, and type contract correctness.

## Usage examples

### Python example (using requests)

```python
# Create a client
from api_integration import create_api

client = create_api(
    # base_url='https://api.example.com'  # baseUrl will be built-in, but can point to a new url if needed
)

def main():
    # simple call
    company = client.company.get_by_id('1234')
    print('company:', company)

    # paginated example
    battles = client.battle.get_battles(page=1, limit=50)
    print('battles:', len(battles['items']))

if __name__ == '__main__':
    try:
        main()
    except Exception as err:
        print('Request failed:', err)
```

### Python async example (using httpx)

```python
import asyncio
from api_integration import create_async_api

async def main():
    client = create_async_api()
    
    # simple async call
    company = await client.company.get_by_id('1234')
    print('company:', company)
    
    # batch multiple calls
    results = await client.batch([
        {'name': 'company.getById', 'params': {'id': '1234'}},
        {'name': 'battle.getBattles', 'params': {'page': 1, 'limit': 10}}
    ])
    
    print('batch results:', results)

if __name__ == '__main__':
    asyncio.run(main())
```

## Design notes / recommended internals

- Factory API: `create_api(config)` returns an object with namespaced resources. This keeps construction and dependency injection easy.
- Request layer: single `_request(path, method='GET', params=None, headers=None, body=None)` used by all endpoint functions.
- Error normalization: wrap non-2xx and network errors into a typed `ApiError` with `status`, `message`, `payload`.
- Retry/backoff: configurable; default to small exponential backoff for idempotent GETs using `tenacity` or similar.
- Pluggable HTTP client: allow passing custom `requests.Session` or `httpx.Client` to support different environments and testing.

## Edge cases & checks

- Empty responses or unexpected shapes — raise a clear error.
- Rate limiting — detect 429 and surface to caller; optionally support `Retry-After` header handling.
- Large result sets — avoid auto-fetching everything unless explicitly requested.
- Timeouts — support configurable timeouts via session configuration.

## Testing & quality gates

- Unit tests for request normalization, pagination helpers, error mapping using `pytest`.
- Integration tests (optional) against a staging instance or mocked HTTP server using `responses` or `httpx-mock`.
- Type checking with mypy recommended.
- Linting with flake8/pylint and code formatting with black.

## Next steps (implementation roadmap)

1. Create `create_api(config)` factory and a single request wrapper.
2. Implement a few core endpoints (e.g., `company.get_by_id`, `battle.get_battles`, `user.get_user_lite`) as examples.
3. Add retries and configurable HTTP client.
4. Expand to cover rest of endpoints, add type hints, and publish package.
5. Implement unit tests to ensure endpoints and API works as intended.

## Contributing

- Follow PEP 8 style guidelines.
- Keep functions small and single-purpose.
- Add unit tests when adding logic (pagination, retries, parsing).
- Create basic functions, the developer(s) will comb through each to ensure they are correctly set up.
- Use type hints for all function signatures.

## Files / structure (suggested)

```
api_integration/
    __init__.py          # Package exports and factory
    client.py            # Factory and client bootstrap
    request.py           # Low-level HTTP wrapper
    exceptions.py        # Custom exception classes
    types.py             # Common type definitions
    resources/
        __init__.py
        company.py       # Company resource methods
        battle.py        # Battle resource methods
        user.py          # User resource methods
        # ... other resource modules
tests/
    test_client.py       # Client and factory tests
    test_request.py      # Request layer tests
    test_resources/
        test_company.py  # Resource-specific tests
        # ... other test modules
```

## Requirements

- Python 3.8+
- requests (or httpx for async support)
- Optional: tenacity (for retry logic)
- Optional: pydantic (for advanced validation)
