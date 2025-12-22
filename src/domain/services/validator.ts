import { z, ZodError } from "zod";

import Result from "@/domain/services/result";

const QueryFields = z.object({
  sort: z.coerce.string().optional(),
  order: z.coerce.string().min(3).max(4).optional(),
  page: z.coerce.number().min(1).max(99).optional(),
  size: z.coerce.number().optional(),
  filter: z.array(z.string()).optional(),
});

export const query = <Resource>(
  keys: Record<keyof RawQueryOptions, unknown>
): Result<QueryOptions<Resource>, ZodError> => {
  if (typeof keys.filter === "string") {
    keys.filter = [keys.filter];
  }

  const result = QueryFields.safeParse(keys);
  if (!result.success) {
    return Result.error(result.error);
  }

  return Result.ok({
    sort: result.data.sort as keyof Resource,
    order: result.data.order,
    size: result.data.size,
    page: result.data.page,
    filter: new Set(result.data.filter as Array<keyof Resource>),
  } satisfies QueryOptions<Resource>);
};

export default {
  query,
  // body, POST
  // partialBody, PUT
};
