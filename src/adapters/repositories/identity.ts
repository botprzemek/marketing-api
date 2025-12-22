import Result from "@/domain/services/result";

const COLUMNS = {
  findByAccount: new Map([
    ["id", "identities.id"],
    ["name", "organizations.name"],
    ["slug", "organizations.slug"],
    ["assignedAt", "strftime('%Y-%m-%dT%H:%M:%S', identities.created_at, 'unixepoch') || '.000Z'"],
  ]) satisfies RepositoryColumns<Identity>,
};

const findByAccount = (D1: D1Database) => (options: RepositoryOptions<Identity>, accountId: UUID) =>
  Result.all<Identity>(
    D1.prepare(
      `
      SELECT
        ${Result.filter(COLUMNS.findByAccount, options.filters)}
      FROM identities
      JOIN organizations
      ON identities.organization_id = organizations.id
      WHERE organizations.is_active = 1
      AND identities.account_id = ?1
      ORDER BY ${Result.sort(COLUMNS.findByAccount, options.sort)} ${options.order}
      LIMIT ${options.limit}
      OFFSET ${options.offset}
    `
    ).bind(accountId)
  );

export default (D1: D1Database) =>
  ({
    findByAccount: findByAccount(D1),
  } satisfies IdentityPort);
