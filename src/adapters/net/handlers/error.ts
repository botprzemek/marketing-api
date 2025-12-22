// import { Context } from "hono";
// import { JwtTokenExpired } from "hono/utils/jwt/types";

// import Auth from "@/domain/services/auth";

// export default (error: Error, c: Context<APIContext>) => {
//   if (error instanceof JwtTokenExpired) {
//     Auth.revokeToken(c, "identity");
//     Auth.revokeToken(c, "refresh");
//     Auth.revokeToken(c, "access");

//     return c.json({ error: "Unauthorized" }, 401);
//   }

//   console.error(error);

//   return c.json({ error: "Internal Server Error" }, 500);
// };
