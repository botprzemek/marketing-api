import { Hono } from "hono";
import routes from "@/adapters/net/router/v1";

export default new Hono().route("/", routes) satisfies ExportedHandler<Env>;
