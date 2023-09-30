export interface PromiseCallback<T> {
  resolve: ResolveFunction<T>;
  reject: RejectFunction;
}

export type ResolveFunction<T> = (value?: T | PromiseLike<T>) => void;

export type RejectFunction = (reason?: Error) => void;
