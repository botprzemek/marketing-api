import Result from "@/domain/services/result";

const columns = [
  ["id", "companies.id"],
  ["name", "companies.name"],
  ["email", "companies.email"],
  ["phone", "companies.phone"],
  ["address", "companies.address"],
  ["website", "companies.website"],
  ["vat", "companies.vat"],
  ["registrationDate", "companies.registration_date"],
  [
    "legalType",
    "(SELECT legal_types.name FROM legal_types WHERE legal_types.id = companies.legal_type_id)",
  ],
  ["createdAt", "companies.created_at"],
  ["updatedAt", "companies.updated_at"],
] as const satisfies CompanyColumns;

const mapSelect = (filters: RepositoryFilters<Company>) =>
  columns
    .filter(([key]) => filters.includes(key))
    .map(([key, column]) => (column ? `${column} AS "${key}"` : key))
    .join(", \n");

const mapSorting = (sort: RepositoryOptions<Company>["sort"]) => {
  const column = columns.find(([key]) => key === sort);
  return column && column[1] ? column[1] : sort;
};

export const find = async (
  d1: D1Database,
  options: RepositoryOptions<Company>,
  organizationId: UUID
) => {
  try {
    const { results } = await d1
      .prepare(
        `
        SELECT
          ${mapSelect(options.filters)}
        FROM companies
        JOIN legal_types
        ON companies.legal_type_id = legal_types.id
        WHERE companies.organization_id = ?1
        ORDER BY ${mapSorting(options.sort)} ${options.order} 
        LIMIT ?2
        OFFSET ?3
      `
      )
      .bind(organizationId, options.limit, options.offset)
      .run<Partial<CompanyRow>>();

    return Result.ok(results);
  } catch (error) {
    return Result.error(error as RepositoryError);
  }
};

export const findByName = async (
  d1: D1Database,
  options: RepositoryOptions<Company>,
  organizationId: UUID,
  name: Company["name"]
) => {
  try {
    const result = await d1
      .prepare(
        `
        SELECT
          ${mapSelect(options.filters)}
        FROM companies
        JOIN legal_types
        ON companies.legal_type_id = legal_types.id
        WHERE companies.organization_id = ?1
        AND companies.name = ?2
        ORDER BY ${mapSorting(options.sort)} ${options.order} 
        LIMIT 1
      `
      )
      .bind(organizationId, name)
      .first<Partial<CompanyRow>>();

    if (!result) {
      throw new Error("Company not found");
    }

    return Result.ok(result);
  } catch (error) {
    return Result.error(error as RepositoryError);
  }
};

export const save = async (
  d1: D1Database,
  options: RepositoryOptions<Company>,
  organizationId: UUID,
  company: Company
) => {
  try {
    const result = await d1
      .prepare(
        `
        INSERT INTO companies
          (
            id,
            organization_id,
            legal_type_id,
            name,
            email,
            phone,
            address,
            website,
            vat,
            registration_date,
            created_at,
            updated_at
          )
        VALUES
          (
            ?1,
            ?2,
            (SELECT id FROM legal_types WHERE legal_types.name = ?3),
            ?4,
            ?5,
            ?6,
            ?7,
            ?8,
            ?9,
            ?10,
            ?11,
            ?12
          )
        RETURNING
          ${mapSelect(options.filters)}
      `
      )
      .bind(
        company.id,
        organizationId,
        company.legalType,
        company.name,
        company.email,
        company.phone,
        company.address,
        company.website,
        company.vat,
        company.registrationDate ? company.registrationDate.toISOString() : null,
        company.createdAt.toISOString(),
        company.updatedAt ? company.updatedAt.toISOString() : null
      )
      .first<Partial<CompanyRow>>();

    if (!result) {
      throw new Error("Company not found");
    }

    return Result.ok(result);
  } catch (error) {
    return Result.error(error as RepositoryError);
  }
};

const editColumns = [
  ["id", "id"],
  ["name", "name"],
  ["email", "email"],
  ["phone", "phone"],
  ["address", "address"],
  ["website", "website"],
  ["vat", "vat"],
  ["registrationDate", "registration_date"],
  ["legalType", "legal_type_id"],
  ["createdAt", "created_at"],
  ["updatedAt", "updated_at"],
] as const satisfies CompanyColumns;

const transform = (company: Partial<Company>) =>
  editColumns
    .filter(([key]) => Object.keys(company).includes(key))
    .map(([key, column], index) => {
      if (key === "legalType") {
        return `${column} = (SELECT id FROM legal_types WHERE name = ?${index + 3})`;
      }
      return `${column} = ?${index + 3}`;
    })
    .join(", ");

export const edit = async (
  d1: D1Database,
  options: RepositoryOptions<Company>,
  organizationId: UUID,
  company: Partial<Company>,
  name: Company["name"]
) => {
  try {
    const result = await d1
      .prepare(
        `
        UPDATE companies
        SET
          ${transform(company)}
        WHERE companies.organization_id = ?1
        AND companies.name = ?2
        RETURNING
          ${mapSelect(options.filters)}
      `
      )
      .bind(
        organizationId,
        name,
        ...Object.values(company).map((value) => {
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        })
      )
      .first<Partial<CompanyRow>>();

    if (!result) {
      throw new Error("Company not found");
    }

    return Result.ok(result);
  } catch (error) {
    return Result.error(error as RepositoryError);
  }
};

export const remove = async (
  d1: D1Database,
  options: RepositoryOptions<Company>,
  organizationId: UUID,
  name: string
) => {
  try {
    const result = await d1
      .prepare(
        `
        DELETE FROM companies
        WHERE companies.organization_id = ?1
        AND companies.name = ?2
        RETURNING
          ${mapSelect(options.filters)}
      `
      )
      .bind(organizationId, name)
      .first<Partial<CompanyRow>>();

    if (!result) {
      throw new Error("Company not found");
    }

    return Result.ok(null);
  } catch (error) {
    return Result.error(error as RepositoryError);
  }
};

export default {
  find,
  findByName,
  save,
  edit,
  remove,
};
