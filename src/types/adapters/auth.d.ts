type AccountId = UUID;
type IdentityId = UUID;
type OrganizationId = UUID;

type TokenId = UUID;

type TokenAudience = "auth:identity_selection" | "auth:refresh" | "auth:api";

interface JWTPayload {
  readonly [key: string]: unknown;
  readonly exp?: number;
  readonly nbf?: number;
  readonly iat?: number;
  readonly iss?: string;
  readonly aud?: string | string[];
}

type TokenType = "identity_selection" | "refresh" | "access";

interface Payload<T extends TokenType> extends JWTPayload {
  sub: AccountId;
  type: T;
  aud: TokenAudience | TokenAudience[];
}

interface IdentitySelectionPayload extends Payload<"identity_selection"> {}

interface ScopedPayload<T extends Exclude<TokenType, "identity_selection">> extends Payload<T> {
  iid: IdentityId;
  oid: OrganizationId;
  auth_version: number;
}

interface RefreshPayload extends ScopedPayload<"refresh"> {
  jti: TokenId;
}

interface AccessPayload extends ScopedPayload<"access"> {}

type TokenPayload = IdentitySelectionPayload | RefreshPayload | AccessPayload;

type PayloadByToken<T extends TokenType> = Extract<TokenPayload, { type: T }>;

type Actor =
  | {
      kind: "identity_selection";
      accountId: AccountId;
    }
  | {
      kind: "authorized";
      identityId: IdentityId;
      accountId: AccountId;
      organizationId: OrganizationId;
    };
