import { Hono } from "hono";
import { validator } from "hono/validator";

import IdentityRepository from "@/adapters/repositories/identity";
import Auth from "@/adapters/auth";

import IdentityApplication from "@/domain/applications/identity";

import ValidatorService from "@/domain/services/validator";
import ResultService from "@/domain/services/result";

const dependencies = (D1: D1Database) =>
  ({
    repository: IdentityRepository(D1),
  } satisfies Dependencies<IdentityPort>);

const Handler = new Hono<APIContext>();

Handler.get("/", validator("query", ValidatorService.query), async (c) => {
  const actorResult = await Auth.requireIdentitySelection(c);
  if (ResultService.isError(actorResult)) {
    return c.json({ error: actorResult.error }, 403);
  }

  const query = c.req.valid("query");
  if (ResultService.isError(query)) {
    return c.json({ error: query.error }, 400);
  }

  const getIdentitiesByAccount = IdentityApplication.makeGetByAccount(dependencies(c.env.D1));
  const { accountId } = actorResult.value;

  const identitiesResult = await getIdentitiesByAccount(query.value, accountId);
  return ResultService.match(identitiesResult, {
    ok: (value) => c.json({ data: value }),
    error: (error) => c.json({ error }, 500),
  });
});

export default Handler;
