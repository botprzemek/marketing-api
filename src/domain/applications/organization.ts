import Options from "@/domain/services/options";

const COLUMNS = new Set<keyof Organization>([
  "id",
  "name",
  "slug",
  "isActive",
  "createdAt",
  "updatedAt",
]);

export const makeGetByAccount =
  ({ repository }: Dependencies<OrganizationPort>) =>
  (query: QueryOptions<Organization>, accountId: UUID) =>
    repository.findByAccount(Options.create(query, COLUMNS), accountId);

export default {
  makeGetByAccount,
};