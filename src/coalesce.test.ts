import { coalesceAsync } from './coalesce';

describe('#coalesceAsync', () => {
  test('given one request then function executed once and resolves', async () => {
    const fn = jest.fn().mockImplementation(async () => {
      return 'some value';
    });

    // Simulate a single request for a value.
    const results = await Promise.allSettled([coalesceAsync('some key', fn)]);

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
    const results = await Promise.allSettled([coalesceAsync('some key', fn)]);

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
      coalesceAsync('some key', fn), // 1
      coalesceAsync('some key', fn), // 2
      coalesceAsync('some key', fn), // 3
      coalesceAsync('some key', fn), // 4
      coalesceAsync('some key', fn), // 5
      coalesceAsync('some key', fn), // 6
      coalesceAsync('some key', fn), // 7
      coalesceAsync('some key', fn), // 8
      coalesceAsync('some key', fn), // 9
      coalesceAsync('some key', fn), // 10
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
      coalesceAsync('some key', fn), // 1
      coalesceAsync('some key', fn), // 2
      coalesceAsync('some key', fn), // 3
      coalesceAsync('some key', fn), // 4
      coalesceAsync('some key', fn), // 5
      coalesceAsync('some key', fn), // 6
      coalesceAsync('some key', fn), // 7
      coalesceAsync('some key', fn), // 8
      coalesceAsync('some key', fn), // 9
      coalesceAsync('some key', fn), // 10
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
      coalesceAsync('some key', fn), // 1
      coalesceAsync('some key', fn), // 2
      coalesceAsync('some key', fn), // 3
      coalesceAsync('some key', fn), // 4
      coalesceAsync('some key', fn), // 5
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
      coalesceAsync('some key', fn), // 1
      coalesceAsync('some key', fn), // 2
      coalesceAsync('some key', fn), // 3
      coalesceAsync('some key', fn), // 4
      coalesceAsync('some key', fn), // 5
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
