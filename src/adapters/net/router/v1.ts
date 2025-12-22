import { Hono } from "hono";

import CorsMiddleware from "@/infrastructure/net/middlewares/cors";
import CacheMiddleware from "@/infrastructure/net/middlewares/cache";
import MetricsMiddleware from "@/infrastructure/net/middlewares/metrics";

import HealthHandler from "@/adapters/http/health";
import AuthHandler from "@/adapters/http/auth";

import OrganizationsHandler from "@/adapters/http/resources/organizations";
import AccountsHandler from "@/adapters/http/resources/organizations";
import IdentitiesHandler from "@/adapters/http/resources/identities";
import RolesHandler from "@/adapters/http/resources/organizations";
import PermissionsHandler from "@/adapters/http/resources/organizations";
// import Organizations from "@/adapters/http/resources/organizations";
// import Accounts from "@/adapters/http/resources/accounts";
// import Identities from "@/adapters/http/resources/identities";
// import Roles from "@/adapters/http/resources/roles";
// import Permissions from "@/adapters/http/resources/permissions";

import ErrorHandler from "@/adapters/http/error";

export default new Hono()
  .basePath("/v1")
  .use(CorsMiddleware)
  .use(CacheMiddleware)
  .use(MetricsMiddleware)
  .all("/", (c) => c.text(`${c.env.API_NAME}@${c.env.API_VERSION}`))
  .route("/health", HealthHandler)
  .route("/auth", AuthHandler)
  .route("/accounts", AccountsHandler)
  .route("/organizations", OrganizationsHandler)
  .route("/identities", IdentitiesHandler)
  .route("/roles", RolesHandler)
  .route("/permissions", PermissionsHandler)
  .onError(ErrorHandler);
