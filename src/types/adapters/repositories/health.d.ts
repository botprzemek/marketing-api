type HealthStatus = "ok" | "down";

interface Health {
  status: HealthStatus;
  api: string;
  version: string;
  timestamp: string;
}
