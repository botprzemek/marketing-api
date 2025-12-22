import { Hono } from "hono";

import OrganizationRepository from "@/adapters/repositories/organization";
import RefreshTokenRepository from "@/adapters/repositories/refreshToken";
import IdentityRepository from "@/adapters/repositories/identity";
import Auth from "@/adapters/auth";

// import AccountApplication from "@/domain/applications/account";

import ValidatorService from "@/domain/services/validator";
import ResultService from "@/domain/services/result";

const Handler = new Hono<APIContext>();

Handler.post("/login", async (c) => {
  // Validator Body validator("json");
  // c.req.valid("json");
  const { email, password } = await c.req.json();

  // AccountApplication
  const account = await ResultService.first<Account>(
    c.env.D1.prepare(
      `SELECT accounts.id AS id, accounts.password_hash AS passwordHash FROM accounts WHERE accounts.email = ?1`
    ).bind(email)
  );
  if (Result.isError(account)) {
    return c.json({ error: "DB_ERROR" }, 500);
  }

  const { id, passwordHash } = account.value;
  if (id === undefined) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  if (!(await Auth.verifyPassword(password, passwordHash))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const sub = id;
  const result = await IdentityRepository(c.env.D1).findByAccount(
    {
      sort: "id",
      order: "ASC",
      limit: 1,
      offset: 0,
      filters: new Set<keyof Identity>(["id"]),
    },
    sub
  );
  if (Result.isError(result)) {
    return c.json({ error: result.error }, 404);
  }

  await Auth.issueIdentity(c, sub);
  Auth.revokeToken(c, "refresh");
  Auth.revokeToken(c, "access");

  return c.body(null, 204);
});

Handler.post("/register", async (c) => {
  const { account, organization } = await c.req.json();

  // AccountRepository.create(c.env.D1, { email, password });
  // OrganizationRepository.create();

  return c.body(null, 204);
});

Handler.post("/logout", async (c) => {
  Auth.revokeToken(c, "identity");
  Auth.revokeToken(c, "refresh");
  Auth.revokeToken(c, "access");

  return c.body(null, 200);
});

Handler.post("/identify", async (c) => {
  const { identityId } = await c.req.json();

  const { sub, type } = await Auth.verifyIdentity(c);
  if (sub === undefined || type !== "identity") {
    return c.json({ error: "Invalid identity token" }, 401);
  }

  const organization = await OrganizationRepository.findByIdentity(
    c.env.D1,
    { filters: new Set(["id"]) },
    identityId,
    sub
  );
  if (Result.isError(organization)) {
    return c.json({ error: organization.error }, 404);
  }

  Auth.revokeToken(c, "identity_selection");
  await Auth.issueRefresh(c, identityId, sub, organization.value.id, RefreshTokenRepository.create);
  await Auth.issueAccess(c, identityId, sub, organization.value.id, 1);

  return c.body(null, 204);
});

Handler.post("/refresh", async (c) => {
  const actorResult = await Auth.requireRefresh(c);
  if (ResultService.isError(actorResult)) {
    return c.json({ error: actorResult.error }, 403);
  }

  Auth.revokeToken(c, "identity_selection");
  const { identityId: iid, accountId: sub, organizationId: oid } = actorResult.value;
  await Auth.issueAccess(c, identityId, sub, oid, 1);

  return c.body(null, 204);
});

export default Handler;
