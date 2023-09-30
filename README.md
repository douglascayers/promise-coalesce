## promise-coalesce

Coalesces multiple promises for the same identifier into a single request.

Reduces load on downstream systems when requests occur at the same time, without dropping requests.

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
