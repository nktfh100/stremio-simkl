import * as Sentry from "@sentry/node";
import { Express } from "express";
import { getConfig } from "./lib/config";

export const initSentry = () => {
  Sentry.init({
    dsn: getConfig().sentry.dsn,
    integrations: [
      Sentry.consoleIntegration(),
      Sentry.captureConsoleIntegration(),
    ],
  });
};

export const setupSentryRequestHandler = (app: Express) => {
  Sentry.setupExpressErrorHandler(app);
};
