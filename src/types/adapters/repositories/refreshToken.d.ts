interface RefreshToken {
  id: UUID;
  accountId: UUID;
  organizationId: UUID;
  identityId: UUID;

  jtiHash: string;

  expiresAt: number;
  issuedAt: number;
  audience: string;

  revokedAt?: Date | null;
  replacedBy?: UUID | null;
}

type RefreshTokenBody = Pick<
  RefreshToken,
  "accountId" | "organizationId" | "identityId" | "jtiHash" | "expiresAt" | "issuedAt" | "audience"
>;

interface RefreshTokenRow extends RefreshToken {
  revokedAt?: number | null;
}
