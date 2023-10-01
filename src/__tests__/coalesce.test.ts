import { coalesceAsync } from '../coalesce';

const coalescingFunc = (key: string, fn: () => PromiseLike<string>) => {
  return coalesceAsync(key, fn);
};

const nonCoalescingFunc = (_key: string, fn: () => PromiseLike<string>) => {
  return fn();
};

// This demonstrates the problem.
describe('non-coalescing function', () => {
  const funcToTest = nonCoalescingFunc;

  test('given ten requests for same key then function executed ten times and resolved to all requests', async () => {
    const fn = jest.fn().mockImplementation(async () => {
      return 'some value';
    });

    // Simulate several concurrent requests for the same value.
    const results = await Promise.allSettled([
      funcToTest('some key', fn), // 1
      funcToTest('some key', fn), // 2
      funcToTest('some key', fn), // 3
      funcToTest('some key', fn), // 4
      funcToTest('some key', fn), // 5
      funcToTest('some key', fn), // 6
      funcToTest('some key', fn), // 7
      funcToTest('some key', fn), // 8
      funcToTest('some key', fn), // 9
      funcToTest('some key', fn), // 10
    ]);

    // Assert that the function was called multiple times (bad).
    expect(fn).toBeCalledTimes(10);

    // Assert that all requests resolved to the same value.
    results.forEach((result) => {
      expect(result).toMatchObject({
        status: 'fulfilled',
        value: 'some value',
      });
    });
  });
});

// This demonstrates the solution.
describe('coalescing function', () => {
  const funcToTest = coalescingFunc;

  test('given one request then function executed once and resolves', async () => {
    const fn = jest.fn().mockImplementation(async () => {
      return 'some value';
    });

    // Simulate a single request for a value.
    const results = await Promise.allSettled([funcToTest('some key', fn)]);

    // Assert that the function was called exactly once.
    expect(fn).toBeCalledTimes(1);

    // Assert that the single request resolved to the expected value.
    results.forEach((result) => {
      expect(result).toMatchObject({
        status: 'fulfilled',
        value: 'some value',
      });
    });
  });

  test('given one request then function executed once and rejects', async () => {
    const fn = jest.fn().mockImplementation(async () => {
      throw new Error('some error');
    });

    // Simulate a single request for a value.
    const results = await Promise.allSettled([funcToTest('some key', fn)]);

    // Assert that the function was called exactly once.
    expect(fn).toBeCalledTimes(1);

    // Assert that the single request resolved to the expected value.
    results.forEach((result) => {
      expect(result).toMatchObject({
        status: 'rejected',
        reason: new Error('some error'),
      });
    });
  });

  test('given ten requests for same key then function executed once and resolved to all requests', async () => {
    const fn = jest.fn().mockImplementation(async () => {
      return 'some value';
    });

    // Simulate several concurrent requests for the same value.
    const results = await Promise.allSettled([
      funcToTest('some key', fn), // 1
      funcToTest('some key', fn), // 2
      funcToTest('some key', fn), // 3
      funcToTest('some key', fn), // 4
      funcToTest('some key', fn), // 5
      funcToTest('some key', fn), // 6
      funcToTest('some key', fn), // 7
      funcToTest('some key', fn), // 8
      funcToTest('some key', fn), // 9
      funcToTest('some key', fn), // 10
    ]);

    // Assert that the function was called exactly once.
    expect(fn).toBeCalledTimes(1);

    // Assert that all requests that were put in escrow
    // resolved to the same value.
    results.forEach((result) => {
      expect(result).toMatchObject({
        status: 'fulfilled',
        value: 'some value',
      });
    });
  });

  test('given ten requests for same key then function executed once and rejects to all requests', async () => {
    const fn = jest.fn().mockImplementation(async () => {
      throw new Error('some error');
    });

    // Simulate several concurrent requests for the same value.
    const results = await Promise.allSettled([
      funcToTest('some key', fn), // 1
      funcToTest('some key', fn), // 2
      funcToTest('some key', fn), // 3
      funcToTest('some key', fn), // 4
      funcToTest('some key', fn), // 5
      funcToTest('some key', fn), // 6
      funcToTest('some key', fn), // 7
      funcToTest('some key', fn), // 8
      funcToTest('some key', fn), // 9
      funcToTest('some key', fn), // 10
    ]);

    // Assert that the function was called exactly once.
    expect(fn).toBeCalledTimes(1);

    // Assert that all requests that were put in escrow
    // resolved to the same value.
    results.forEach((result) => {
      expect(result).toMatchObject({
        status: 'rejected',
        reason: new Error('some error'),
      });
    });
  });

  test('given multiple requests, wait, then more requests then function executed twice and resolves', async () => {
    const fn = jest.fn().mockImplementation(async () => {
      return 'some value';
    });

    // Simulate a first batch of requests.
    const results1 = await Promise.allSettled([
      funcToTest('some key', fn), // 1
      funcToTest('some key', fn), // 2
      funcToTest('some key', fn), // 3
      funcToTest('some key', fn), // 4
      funcToTest('some key', fn), // 5
    ]);

    // Assert that the function was called exactly once.
    expect(fn).toBeCalledTimes(1);
    fn.mockClear();

    // Assert that the single request resolved to the expected value.
    results1.forEach((result) => {
      expect(result).toMatchObject({
        status: 'fulfilled',
        value: 'some value',
      });
    });

    // Simulate a second batch of requests.
    const results2 = await Promise.allSettled([
      funcToTest('some key', fn), // 1
      funcToTest('some key', fn), // 2
      funcToTest('some key', fn), // 3
      funcToTest('some key', fn), // 4
      funcToTest('some key', fn), // 5
    ]);

    // Assert that the function was called exactly once.
    expect(fn).toBeCalledTimes(1);
    fn.mockClear();

    // Assert that the single request resolved to the expected value.
    results2.forEach((result) => {
      expect(result).toMatchObject({
        status: 'fulfilled',
        value: 'some value',
      });
    });
  });
});
