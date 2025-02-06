import dotenv from "dotenv";

export type Config = {
  simkl: {
    clientId: string;
    clientSecret: string;
  };
  encryption: {
    key: string;
    salt: string;
  };
  redis: {
    enabled: boolean;
    username: string;
    password: string;
    port: number;
    host: string;
  };
  rpdb: {
    enabled: boolean;
    apiKey: string;
  };
  sentry: {
    enabled: boolean;
    dsn: string;
  };
  env: string;
  port: number;
  tmdbApiKey: string;
  backendHost: string;
  frontendUrl: string;
  enableMetrics: boolean;
};

let config: Config | null = null;

export const loadConfig = (): Config => {
  dotenv.config();

  return {
    simkl: {
      clientId: process.env.SIMKL_CLIENT_ID || "",
      clientSecret: process.env.SIMKL_CLIENT_SECRET || "",
    },
    encryption: {
      key: process.env.ENCRYPTION_KEY || "",
      salt: process.env.ENCRYPTION_SALT || "",
    },
    tmdbApiKey: process.env.TMDB_API_KEY || "",
    redis: {
      enabled: process.env.DISABLE_REDIS !== "true",
      username: process.env.REDIS_USERNAME || "",
      password: process.env.REDIS_PASSWORD || "",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      host: process.env.REDIS_HOST || "",
    },
    sentry: {
      enabled: process.env.ENABLE_SENTRY === "true",
      dsn: process.env.SENTRY_DSN || "",
    },
    rpdb: {
      enabled: process.env.RPDB_ENABLED === "true",
      apiKey: process.env.RPDB_API_KEY || "",
    },
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "43001"),
    backendHost: process.env.BACKEND_HOST || "",
    frontendUrl: process.env.FRONTEND_URL || "",
    enableMetrics: process.env.ENABLE_METRICS === "true",
  };
};

export const getConfig = (): Config => {
  if (config === null) {
    config = loadConfig();
  }

  return config;
};
