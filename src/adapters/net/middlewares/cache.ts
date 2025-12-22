import { createFactory } from "hono/factory";
import { cache as honoCache } from "hono/cache";

const factory = createFactory<APIContext>();

export const cache = factory.createMiddleware(async (c, next) => {
  if (c.env.CLOUDFLARE_ENV === "development") {
    return next();
  }

  if (c.req.method !== "GET") {
    return next();
  }

  return honoCache({
    cacheName: "marketing-api",
    cacheControl: "max-age=3600",
  })(c, next);
});

export default cache;
