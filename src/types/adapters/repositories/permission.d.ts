type Permission = {
  id: UUID;
  organizationId: UUID;

  name: string;
  description?: string | null;

  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
};

type PermissionBody = Pick<Permission, "organizationId" | "name" | "description">;

interface PermissionRow extends Permission {
  isActive: number;
  createdAt: number;
  updatedAt?: number | null;
}
