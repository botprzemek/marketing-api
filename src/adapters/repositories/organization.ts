import Result from "@/domain/services/result";

const COLUMNS = {
  findByAccount: new Map([
    ["id", "organizations.id"],
    ["name", "organizations.name"],
    ["slug", "organizations.slug"],
    ["isActive", "organizations.is_active"],
    ["createdAt", "organizations.created_at"],
    ["updatedAt", "organizations.updated_at"],
  ]) satisfies RepositoryColumns<Organization>,
  
  find: new Map([
    ["id", "organizations.id"],
    ["name", "organizations.name"],
    ["slug", "organizations.slug"],
    ["isActive", "organizations.is_active"],
    ["createdAt", "organizations.created_at"],
    ["updatedAt", "organizations.updated_at"],
  ]) satisfies RepositoryColumns<Organization, "organizations">,
};

const findByAccount = (D1: D1Database) => (options: RepositoryOptions<Organization>, accountId: UUID) =>
  Result.all<Organization>(
    D1.prepare(
      `
      SELECT
        ${Result.filter(COLUMNS.findByAccount, options.filters)}
      FROM organizations
      JOIN identities
      ON organizations.id = identities.organization_id
      WHERE organizations.is_active = 1
      AND identities.account_id = ?1
      ORDER BY ${Result.sort(COLUMNS.findByAccount, options.sort)} ${options.order}
      LIMIT ${options.limit}
      OFFSET ${options.offset}
    `
    ).bind(accountId)
  );

const findByIdentity = (D1: D1Database) => (
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

export default (D1: D1Database) =>
  ({
    findByAccount: findByAccount(D1),
    findByIdentity: findByIdentity(D1),
  } satisfies OrganizationPort);
