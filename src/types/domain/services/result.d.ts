type ResultType = "ok" | "error";

type Result<T, E> = Ok<T> | Err<E>;

interface Ok<T> {
  readonly type: Extract<ResultType, "ok">;
  readonly value: T;
}

interface Err<E extends Error> {
  readonly type: Extract<ResultType, "error">;
  readonly error: E;
}
