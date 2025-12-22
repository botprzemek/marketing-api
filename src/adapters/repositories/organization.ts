import Result from "@/domain/services/result";

const COLUMNS = {
  find: new Map([
    ["id", "organizations.id"],
    ["name", "organizations.name"],
    ["slug", "organizations.slug"],
    ["isActive", "organizations.is_active"],
    ["createdAt", "organizations.created_at"],
    ["updatedAt", "organizations.updated_at"],
  ]) satisfies RepositoryColumns<Organization, "organizations">,
};

const find = (
  D1: D1Database,
  options: Pick<RepositoryOptions<Organization>, "filters">,
  identityId: UUID,
  accountId: UUID,
  organizationId: UUID
) =>
  Result.first<Organization>(
    D1.prepare(
      `
      SELECT
        ${Result.filter(COLUMNS.find, options.filters)}
      FROM organizations
      JOIN identities
      ON organizations.id = ?3
      AND identities.id = ?1
      AND identities.account_id = ?2
      LIMIT 1
    `
    ).bind(identityId, accountId, organizationId)
  );

const findByIdentity = (
  D1: D1Database,
  options: Pick<RepositoryOptions<Organization>, "filters">,
  identityId: UUID,
  accountId: UUID
) =>
  Result.first<Organization>(
    D1.prepare(
      `
      SELECT
        ${Result.filter(COLUMNS.find, options.filters)}
      FROM organizations
      JOIN identities
      ON organizations.id = identities.organization_id
      AND identities.id = ?1
      AND identities.account_id = ?2
      LIMIT 1
    `
    ).bind(identityId, accountId)
  );

export default {
  find,
  findByIdentity,
};
