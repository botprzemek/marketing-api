import Result from "@/domain/services/result";

const find = async (
  D1: D1Database,
  options: Pick<RepositoryOptions<Health>, "filters">,
  api: string,
  version: string
) => {
  const data = (status: HealthStatus) =>
    ({
      status,
      api,
      version,
      timestamp: new Date().toISOString(),
    } satisfies Health);

  try {
    await D1.exec("SELECT 1");

    return Result.ok(data("ok"));
  } catch (e) {
    return Result.ok(data("down"));
  }
};

export default {
  find,
};
