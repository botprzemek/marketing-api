interface Role {
  id: UUID;
  organizationId: UUID;

  name: string;
  description?: string | null;

  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
}

type RoleBody = Pick<Roles, "organizationId" | "name" | "description">;

interface RoleRow extends Roles {
  isActive: number;
  createdAt: number;
  updatedAt?: number | null;
}
