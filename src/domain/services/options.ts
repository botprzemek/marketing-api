const ORDER_TYPE = {
  ASC: "ASC",
  DESC: "DESC",
} as const satisfies Record<QueryOrder, QueryOrder>;

const sort =
  <Resource>(columns: Set<keyof Resource>) =>
  (sort?: keyof Resource) =>
    sort && columns.has(sort) ? sort : columns.values().next().value!;

const order = (order: unknown = ORDER_TYPE.ASC) =>
  typeof order === "string"
    ? order.toUpperCase() === ORDER_TYPE.DESC
      ? ORDER_TYPE.DESC
      : ORDER_TYPE.ASC
    : ORDER_TYPE.ASC;

const limit = (size: unknown = -1) => (typeof size === "number" ? size : -1);

const offset = (page: unknown = 0, size: unknown = 0) =>
  typeof page === "number" ? page - 1 * limit(size) : 0;

const filter =
  <Resource>(columns: Set<keyof Resource>) =>
  (filters = columns) =>
    columns.values().some((column) => filters.has(column)) ? new Set(filters) : columns;

export const create = <Resource>(
  query: QueryOptions<Resource>,
  columns: Set<keyof Resource>
): RepositoryOptions<Resource> => ({
  sort: sort(columns)(query.sort),
  order: order(query.order),
  limit: limit(query.size),
  offset: offset(query.page, query.size),
  filters: filter(columns)(query.filter),
});

export default {
  create,
};
