import { createFactory } from "hono/factory";

const factory = createFactory<APIContext>();

export const cors = factory.createMiddleware(async (c, next) => {
  c.res.headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
  c.res.headers.append("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  c.res.headers.append("Access-Control-Allow-Headers", "");
  c.res.headers.append("Access-Control-Expose-Headers", "X-Response-Time");
  c.res.headers.append("Access-Control-Allow-Credentials", "true");

  c.res.headers.append("Vary", "Origin");

  if (c.req.method === "OPTIONS") {
    return c.text("OK", 200);
  }

  return next();
});

export default cors;
