interface Organization {
  id: UUID;

  name: string;
  slug: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type OrganizationBody = Pick<Organization, "name" | "slug">;

interface OrganizationRow extends Organization {
  is_active: number;
  createdAt: number;
  updatedAt?: number | null;
}
