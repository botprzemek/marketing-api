interface IdentityPort {
  readonly findByAccount: (
    options: RepositoryOptions<Identity>,
    accountId: UUID
  ) => Promise<Result<Array<PickColumns<Identity>>, RepositoryError>>;
}
