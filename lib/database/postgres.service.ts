import "server-only";

import postgres, { type Sql } from "postgres";

const DATABASE_URL_ENV_KEYS = [
  "DATABASE_URL_POOLED",
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
] as const;

let postgresClient: Sql<Record<string, unknown>> | null = null;

function resolveDatabaseUrl(): string {
  for (const envKey of DATABASE_URL_ENV_KEYS) {
    const value = process.env[envKey];
    if (value) {
      return value;
    }
  }

  throw new Error(
    `Missing database connection string. Set one of: ${DATABASE_URL_ENV_KEYS.join(", ")}`,
  );
}

export function getPostgresClient(): Sql<Record<string, unknown>> {
  if (postgresClient) {
    return postgresClient;
  }

  postgresClient = postgres(resolveDatabaseUrl(), {
    idle_timeout: 20,
    max: 1,
    prepare: false,
  });

  return postgresClient;
}
