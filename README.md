## promise-coalesce

Coalesces multiple promises for the same identifier into a single request.

Reduces load on downstream systems when requests occur at the same time,
without dropping requests or needing exclusion locks or wait-and-retry attempts.

## Install

With npm:

```sh
npm install promise-coalesce
```

With yarn:

```sh
yarn add promise-coalesce
```

## Usage

```ts
import { coalesceAsync } from 'promise-coalesce';

await coalesceAsync('some-group-key', async () => {
  /* your logic */
});
```

## Example

**Cache Miss Relief Buffer**

```ts
import { coalesceAsync } from 'promise-coalesce';

// Assume you have a function to fetch a value from a cache.
// When there's a cache miss then you fetch the value from the source system.
// Querying the source system may be an expensive database call
// or an API request to another system that enforces rate limiting.
async function getValue(cacheKey: string): Promise<object> {
  // If multiple requests occur at the same time to get
  // the same cache value, because of the nature of async
  // and the event loop then they each may all call `cache.get`
  let cachedValue = await cache.get(cacheKey);
  // They would then take turns evaluating and entering the condition
  // because they would each see that the value doesn't exist yet
  if (!cachedValue) {
    // They each would then call `coalesceAsync`
    // However, because we are coalescing the requests then
    // the expensive call to fetch from the source system
    // only occurs once and the other requests resolve with
    // that same value at the end :)
    cachedValue = await coalesceAsync(cacheKey, async () => {
      /* fetch value from source system */
    });
    // Now the value is cached and future requests will skip
    // calling the source system entirely until the TTL expires
    await cache.set(cacheKey, cachedValue, ttl);
  }
  return cachedValue;
}
```
