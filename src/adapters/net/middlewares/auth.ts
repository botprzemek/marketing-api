import { jwt } from "hono/jwt";
import { createFactory } from "hono/factory";

import Auth from "@/domain/services/auth";

const factory = createFactory<APIContext>();

export const auth = factory.createMiddleware(async (c, next) =>
  jwt(Auth.middlewareOptions(c))(c, next)
);

export default auth;
