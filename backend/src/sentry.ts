import * as Sentry from "@sentry/node";

export const initSentry = () => {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
};
