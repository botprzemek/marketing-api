type UUID = `${string}-${string}-${string}-${string}-${string}` & string;

type CamelToSnake<S extends string> = S extends `${infer First}${infer Rest}`
  ? Rest extends Uncapitalize<Rest>
    ? `${Lowercase<First>}${CamelToSnake<Rest>}`
    : `${Lowercase<First>}_${CamelToSnake<Rest>}`
  : S;

type CloudflareEnvironment = "development" | "production";

interface Bindings {
  D1: D1Database;
  KV: KVNamespace;

  CLOUDFLARE_ENV: CloudflareEnvironment;
  API_DOMAIN: string;
  API_HOST: string;
  API_NAME: string;
  API_VERSION: string;

  JWT_IDENTITY_PRIVATE_KEY: string;
  JWT_REFRESH_PRIVATE_KEY: string;
  JWT_ACCESS_PRIVATE_KEY: string;
  JWT_IDENTITY_PUBLIC_KEY: string;
  JWT_REFRESH_PUBLIC_KEY: string;
  JWT_ACCESS_PUBLIC_KEY: string;
}

interface APIContext {
  Bindings: Bindings;
}
