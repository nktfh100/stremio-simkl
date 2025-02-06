import * as Sentry from "@sentry/node";
import { Express } from "express";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      Sentry.consoleIntegration(),
      Sentry.captureConsoleIntegration(),
    ],
  });
};

export const setupSentryRequestHandler = (app: Express) => {
  Sentry.setupExpressErrorHandler(app);
};
