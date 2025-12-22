interface Account {
  id: UUID;

  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
}

type AccountBody = Pick<Account, "email" | "passwordHash" | "firstName" | "lastName">;

interface AccountRow extends Account {
  isActive: number;
  createdAt: number;
  updatedAt?: number | null;
}
