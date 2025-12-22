import { Context } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";

import { uuidv4 } from "uuidv7";

import ResultService from "@/domain/services/result";

const SALT_SIZE = 16;

const generateSalt = () =>
  crypto
    .getRandomValues(new Uint8Array(SALT_SIZE))
    .reduce((acc, byte) => acc + byte.toString(SALT_SIZE).padStart(2, "0"), "");

const hash = async (unsecureInput: string) => {
  const data = new TextEncoder().encode(unsecureInput);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(SALT_SIZE).padStart(2, "0"))
    .join("");
};

export const createPasswordHash = async (password: string) => {
  const salt = generateSalt();

  return salt + (await hash(salt + password));
};

export const createJTIHash = async () => hash(uuidv4());

export const verifyPassword = async (password: string, stored: string) => {
  const salt = stored.slice(0, SALT_SIZE * 2);
  const hashed = stored.slice(SALT_SIZE * 2);

  return hashed === (await hash(salt + password));
};

export const verifyJTI = async (jti: string, stored: string) => stored === (await hash(jti));

const TOKEN_ALGORITHM = "RS256" as const;

const TOKEN_AUDIENCE = {
  identity_selection: "auth:identity_selection",
  access: "auth:api",
  refresh: "auth:refresh",
} as const satisfies Record<TokenType, TokenAudience>;

const TOKEN_EXPIRE = {
  identity_selection: 3 * 60,
  access: 15 * 60,
  refresh: 7 * 24 * 60 * 60,
} as const satisfies Record<TokenType, number>;

const createIdentityPayload = (sub: UUID, iss: string) =>
  ({
    sub,
    type: "identity_selection",
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRE.identity_selection,
    iat: Math.floor(Date.now() / 1000),
    iss,
    aud: TOKEN_AUDIENCE.identity_selection,
  } satisfies IdentitySelectionPayload);

const createRefreshPayload = (iid: UUID, sub: UUID, oid: UUID, jti: UUID, iss: string) =>
  ({
    iid,
    sub,
    oid,
    jti,
    auth_version: 1,
    type: "refresh",
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRE.refresh,
    iat: Math.floor(Date.now() / 1000),
    iss,
    aud: TOKEN_AUDIENCE.refresh,
  } satisfies RefreshPayload);

const createAccessPayload = (iid: UUID, sub: UUID, oid: UUID, iss: string, auth_version: number) =>
  ({
    iid,
    sub,
    oid,
    auth_version,
    type: "access",
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRE.access,
    iat: Math.floor(Date.now() / 1000),
    iss,
    aud: TOKEN_AUDIENCE.access,
  } satisfies AccessPayload);

export const signToken = (payload: TokenPayload, privateKey: string) =>
  sign(payload, privateKey, TOKEN_ALGORITHM);

const COOKIE_NAME = (type: TokenType) => `marketing-api-${type}-token`;

const COOKIE_PATH = {
  identity_selection: "/auth/identity",
  refresh: "/auth/refresh",
  access: "/",
} as const satisfies Record<TokenType, string>;

const COOKIE_HTTP = true as const;

const COOKIE_SECURE = (env: CloudflareEnvironment) => env === "production";

const COOKIE_DOMAIN = (domain?: string) => domain ?? "localhost";

const COOKIE_SAME_SITE = "Strict" as const;

const setToken = (c: Context<APIContext>, type: TokenType, token: string) =>
  setCookie(c, COOKIE_NAME(type), token, {
    path: COOKIE_PATH[type],
    httpOnly: COOKIE_HTTP,
    secure: COOKIE_SECURE(c.env.CLOUDFLARE_ENV),
    domain: COOKIE_DOMAIN(c.env.API_DOMAIN),
    sameSite: COOKIE_SAME_SITE,
    maxAge: TOKEN_EXPIRE[type],
  });

const issueToken = async <T extends TokenType>(
  c: Context,
  type: T,
  payload: PayloadByToken<T>,
  privateKey: string
) => setToken(c, type, await signToken(payload, privateKey));

export const issueIdentity = (c: Context<APIContext>, sub: UUID) =>
  issueToken(
    c,
    "identity_selection",
    createIdentityPayload(sub, c.env.API_HOST),
    c.env.JWT_IDENTITY_PRIVATE_KEY
  );

export const issueRefresh = async (
  c: Context<APIContext>,
  iid: UUID,
  sub: UUID,
  oid: UUID,
  repositoryCreateRefreshToken: Function
) => {
  const jti = uuidv4() as UUID;
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + TOKEN_EXPIRE.refresh * 1000);

  await repositoryCreateRefreshToken(
    c.env.D1,
    {},
    iid,
    sub,
    oid,
    await hash(jti),
    expiresAt,
    issuedAt,
    TOKEN_AUDIENCE.refresh
  );

  return issueToken(
    c,
    "refresh",
    createRefreshPayload(iid, sub, oid, jti, c.env.API_HOST),
    c.env.JWT_REFRESH_PRIVATE_KEY
  );
};

export const issueAccess = (
  c: Context<APIContext>,
  iid: UUID,
  sub: UUID,
  oid: UUID,
  auth_version: number
) =>
  issueToken(
    c,
    "access",
    createAccessPayload(iid, sub, oid, c.env.API_HOST, auth_version),
    c.env.JWT_ACCESS_PRIVATE_KEY
  );

export const revokeToken = (c: Context<APIContext>, type: TokenType) =>
  setCookie(c, COOKIE_NAME(type), "", {
    path: COOKIE_PATH[type],
    httpOnly: COOKIE_HTTP,
    secure: COOKIE_SECURE(c.env.CLOUDFLARE_ENV),
    domain: COOKIE_DOMAIN(c.env.API_DOMAIN),
    sameSite: COOKIE_SAME_SITE,
    maxAge: 0,
    expires: new Date(0),
  });

const getTokenCookie = (c: Context<APIContext>, type: TokenType) =>
  getCookie(c, COOKIE_NAME(type)) ?? "";

const payloadValidation = (c: Context<APIContext>, type: TokenType) => ({
  alg: TOKEN_ALGORITHM,
  exp: true,
  iat: true,
  iss: c.env.API_HOST,
  aud: TOKEN_AUDIENCE[type],
});

const verifyToken = <T extends TokenType>(c: Context<APIContext>, type: T, publicKey: string) =>
  verify(getTokenCookie(c, type), publicKey, payloadValidation(c, type)) as Promise<
    PayloadByToken<T>
  >;

const verifyIdentity = (c: Context<APIContext>) =>
  verifyToken(c, "identity_selection", c.env.JWT_IDENTITY_PUBLIC_KEY);

const verifyRefresh = (c: Context<APIContext>) =>
  verifyToken(c, "refresh", c.env.JWT_REFRESH_PUBLIC_KEY);

const verifyAccess = (c: Context<APIContext>) =>
  verifyToken(c, "access", c.env.JWT_ACCESS_PUBLIC_KEY);

const middlewareOptions = (c: Context<APIContext>) => ({
  cookie: COOKIE_NAME("access"),
  alg: TOKEN_ALGORITHM,
  secret: c.env.JWT_ACCESS_PUBLIC_KEY,
  verification: payloadValidation(c, "access"),
});

const getActorFromIdentity = async (c: Context<APIContext>) => {
  const { sub } = await verifyIdentity(c);

  return {
    kind: "identity_selection",
    accountId: sub,
  } satisfies Actor;
};

const getActorFromRefresh = async (c: Context<APIContext>) => {
  const { iid, sub, oid } = await verifyRefresh(c);

  return {
    kind: "authorized",
    identityId: iid,
    accountId: sub,
    organizationId: oid,
  } satisfies Actor;
};

const getActorFromAccess = async (c: Context<APIContext>) => {
  const { iid, sub, oid } = c.get("jwtPayload"); //await verifyAccess(c);

  return {
    kind: "authorized",
    identityId: iid,
    accountId: sub,
    organizationId: oid,
  } satisfies Actor;
};

export const requireIdentitySelection = async (c: Context<APIContext>) => {
  const actor = await getActorFromIdentity(c);

  if (actor.kind !== "identity_selection") {
    return ResultService.error(new Error("Identity selection required"));
  }

  return ResultService.ok(actor);
};

export const requireRefresh = async (c: Context<APIContext>) => {
  const actor = await getActorFromRefresh(c);

  if (actor.kind !== "authorized") {
    return ResultService.error(new Error("Authorization required"));
  }

  return ResultService.ok(actor);
};

export const requireAccess = async (c: Context<APIContext>) => {
  const actor = await getActorFromAccess(c);

  if (actor.kind !== "authorized") {
    return ResultService.error(new Error("Authorization required"));
  }

  return ResultService.ok(actor);
};

export default {
  createPasswordHash,
  createJTIHash,
  verifyPassword,
  verifyJTI,
  issueIdentity,
  issueRefresh,
  issueAccess,
  revokeToken,
  requireIdentitySelection,
  requireRefresh,
  requireAccess,
  middlewareOptions,
};
