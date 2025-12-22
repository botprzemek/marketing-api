import { Hono } from "hono";
import { validator } from "hono/validator";

import OrganizationApplication from "@/domain/applications/organization";
import OrganizationRepository from "@/adapters/repositories/organization";

import ValidatorService from "@/domain/services/validator";
import ResultService from "@/domain/services/result";

import AuthMiddleware from "@/infrastructure/net/middlewares/auth";

const dependencies = (D1: D1Database) =>
  ({
    repository: OrganizationRepository(D1),
  } satisfies Dependencies<IdentityPort>);

const Handler = new Hono<APIContext>().use(AuthMiddleware);

Handler.get("/", validator("query", ValidatorService.query), async (c) => {
  const { iid, sub, oid } = c.get("jwtPayload");
  const query = c.req.valid("query");
  if (ResultService.isError(query)) {
    return c.json({ error: query.error }, 500);
  }

  const getIdentities = Organization.makeGetByAccount(dependencies(c.env.D1));
  const result = await getIdentities(query.value, sub);
  if (ResultService.isError(result)) {
    return c.json({ error: result.error }, 500);
  }

  return c.json({ data: result.value });
});

export default Handler;
