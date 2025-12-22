import Result from "@/domain/services/result";
import { uuidv7 } from "uuidv7";

const columns = [["id", "refresh_tokens.id"]] as const satisfies RepositoryColumns<
  RefreshToken,
  "organizations"
>;

const create = (
  D1: D1Database,
  options: RepositoryOptions<RefreshToken>,
  identityId: UUID,
  accountId: UUID,
  organizationId: UUID,
  jtiHash: string,
  expiresAt: Date,
  issuedAt: Date,
  audience: string
) =>
  Result.none<RefreshToken>(
    D1.prepare(
      `
      INSERT INTO refresh_tokens
        (id, identity_id, account_id, organization_id, jti_hash, expires_at, issued_at, audience)
      VALUES
        (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      RETURNING *
    `
      // ${Helper.filter(columns, options.filters)}
    ).bind(
      uuidv7(),
      identityId,
      accountId,
      organizationId,
      jtiHash,
      Math.floor(expiresAt.getTime() / 1000),
      Math.floor(issuedAt.getTime() / 1000),
      audience
    )
  );

const update = (
  D1: D1Database,
  options: RepositoryOptions<Organization>,
  identityId: UUID,
  accountId: UUID
) =>
  Result.first<Organization>(
    D1.prepare(
      `
      SELECT
        ${Result.filter(columns, options.filters)}
      FROM organizations
      JOIN identities
      ON organizations.id = identities.organization_id
      AND identities.id = ?1
      AND identities.account_id = ?2
    `
    ).bind(identityId, accountId)
  );

export default {
  create,
  update,
};
