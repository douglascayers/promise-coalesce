const promises = new Map<string, Promise<any>>();

/**
 * Enqueue a promise for the group identified by `key`.
 *
 * All requests received for the same key while a request for that key
 * is already being executed will wait. Once the running request settles
 * then all the waiting requests in the group will settle, too.
 * This minimizes how many times the function itself runs at the same time.
 * This function resolves or rejects according to the given function argument.
 */
export async function coalesceAsync<T>(
  /**
   * Any identifier to group requests together.
   */
  key: string,
  /**
   * The function to run.
   */
  fn: () => T | PromiseLike<T>
): Promise<T> {
  let promise = promises.get(key);

  if (promise) {
    return promise;
  }

  promise = new Promise<T>((resolve, reject) => {
    try {
      Promise.resolve(fn()).then(resolve).catch(reject);
    } catch (error) {
      reject(error);
    }
  }).finally(() => {
    promises.delete(key);
  });

  promises.set(key, promise);

  return promise;
}
