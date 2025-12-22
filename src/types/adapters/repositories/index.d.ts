type ColumnName = `${Table}.${CamelToSnake<keyof Resource>}`;

type RepositoryColumns<Resource, Table = ""> = Map<
  keyof Resource,
  ColumnName | `${string}(${ColumnName})`
>;

type RepositoryOptions<Resource> = {
  readonly sort: keyof Resource;
  readonly order: QueryOrder;
  readonly limit: number;
  readonly offset: number;
  readonly filters: RepositoryFilters<Resource>;
};

type RepositoryFilters<Resource> = Set<keyof Resource>;

type PickColumns<Resource> = {
  readonly [K in keyof Resource]: Resource[K];
};

interface RepositoryError extends Error {
  readonly status: number;
  readonly message: string;
}

interface Port<Resource> {
  readonly [method: string]: (
    d1: D1Database,
    options: RepositoryOptions<Resource>,
    ...args: Array
  ) => Promise<Result<Array<Partial<Resource>> | Partial<Resource>, RepositoryError>>;
}

interface Dependencies<Port> {
  readonly repository: Port;
}
