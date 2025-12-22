interface Identity {
  id: UUID;

  name: string;
  slug: string;
  assignedAt: Date;
}

interface IdentityRow extends Identity {
  assignedAt: number;
}
