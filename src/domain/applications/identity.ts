import Options from "@/domain/services/options";

const COLUMNS = new Set<keyof Identity>(["id", "name", "slug", "assignedAt"]);

export const makeGetByAccount =
  ({ repository }: Dependencies<IdentityPort>) =>
  (query: QueryOptions<Identity>, accountId: UUID) =>
    repository.findByAccount(Options.create(query, COLUMNS), accountId);

export default {
  makeGetByAccount,
};
