type QueryOrder = "ASC" | "DESC";

interface RawQueryOptions {
  sort?: unknown;
  order?: unknown;
  size?: unknown;
  page?: unknown;
  filter?: Array<unknown>;
}

interface QueryOptions<Resource> extends RawQueryOptions {
  readonly sort?: keyof Resource;
  readonly order?: string;
  readonly size?: number;
  readonly page?: number;
  readonly filter?: Set<keyof Resource>;
}
