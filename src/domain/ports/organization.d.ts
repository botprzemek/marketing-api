interface OrganizationPort {
  readonly findByAccount: (
    options: RepositoryOptions<Organization>,
    accountId: UUID
  ) => Promise<Result<Array<PickColumns<Organization>>, RepositoryError>>;
  
  readonly findByIdentity: (
    options: Pick<RepositoryOptions<Organization>, "filters">,
    identityId: UUID,
    accountId: UUID
  ) => Promise<Result<Organization, RepositoryError>>;
}