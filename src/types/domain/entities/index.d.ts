interface Entity<T, U> {
  create(...args: U): T;
  update(...args: Partial<U>): Partial<T>;
}
