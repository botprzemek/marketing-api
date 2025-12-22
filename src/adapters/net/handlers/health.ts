import { Hono } from "hono";

import HealthRepository from "@/adapters/repositories/health";

const Handler = new Hono<APIContext>();

Handler.get(async (c) => {
  const result = await HealthRepository.find(
    c.env.D1,
    {
      filters: new Set(["status", "api", "version"]),
    },
    c.env.API_NAME,
    c.env.API_VERSION
  );

  return c.json(result.value);
});

export default Handler;
