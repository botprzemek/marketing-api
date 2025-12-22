export const ok = <T>(value: T) => ({ type: "ok", value } satisfies Ok<T>);

export const error = <E extends Error>(error: E) => ({ type: "error", error } satisfies Err<E>);

export const isOk = <T, E extends Error>(result: Result<T, E>): result is Ok<T> =>
  result.type === "ok";

export const isError = <T, E extends Error>(result: Result<T, E>): result is Err<E> =>
  result.type === "error";

export const match = <T, E extends Error, R, Q>(
  result: Result<T, E>,
  handlers: {
    ok: (value: T) => R;
    error: (error: E) => Q;
  }
) => (isOk(result) ? handlers.ok(result.value) : handlers.error(result.error));

const none = async <Resource>(statement: D1PreparedStatement) => {
  try {
    const result = await statement.all<PickColumns<Resource> | null>();
    if (!result) {
      throw new Error("NOT_FOUND");
    }

    return ok(result);
  } catch (err) {
    console.log(err);
    return error(err as RepositoryError);
  }
};

const first = async <Resource>(statement: D1PreparedStatement) => {
  try {
    const result = await statement.first<PickColumns<Resource> | null>();
    if (!result) {
      throw new Error("NOT_FOUND");
    }

    return ok(result);
  } catch (err) {
    console.log(err);
    return error(err as RepositoryError);
  }
};

const all = async <Resource>(statement: D1PreparedStatement) => {
  try {
    const { results } = await statement.all<PickColumns<Resource>>();
    if (!results) {
      throw new Error("NOT_FOUND");
    }

    return ok(results);
  } catch (err) {
    console.log(err);
    return error(err as RepositoryError);
  }
};

const filter = <Resource, Table = "">(
  columns: RepositoryColumns<Resource, Table>,
  filters: RepositoryFilters<Resource>
) =>
  columns
    .keys()
    .filter((key) => filters.has(key))
    .map((key) => (columns.has(key) ? `${columns.get(key)} AS "${String(key)}"` : key))
    .toArray()
    .join(", ");

const sort = <Resource, Table = "">(
  columns: RepositoryColumns<Resource, Table>,
  sort: keyof Resource
) =>
  columns.keys().find((key) => key === sort) ? columns.get(sort)! : columns.values().next().value!;

export default {
  ok,
  error,
  isOk,
  isError,
  match,
  none,
  first,
  all,
  filter,
  sort,
};
