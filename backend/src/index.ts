import cors from "cors";
import express from "express";

import { connectToRedis } from "@/cache";
import { initEncryption } from "@/encryption";
import registerCatalogRoute from "@/routes/catalog";
import registerGenerateLinkRoute from "@/routes/generateLink";
import registerManifestRoute from "@/routes/manifest";

import registerConfigureRoute from "./routes/configure";
import { initMetrics, metricsEndpoint, metricsMiddleware } from "./metrics";

// import { publishToCentral } from "stremio-addon-sdk";
import { initSentry, setupSentryRequestHandler } from "./sentry";
import { getConfig } from "./lib/config";

const config = getConfig();

if (config.sentry.enabled) {
  initSentry();
}

initEncryption();

const app = express();

app.use(cors());
app.use(express.json());

if (config.enableMetrics) {
  initMetrics();
  app.use(metricsMiddleware);
  app.get("/metrics", metricsEndpoint);
}

app.get("/", (_req, res) => {
  res.redirect(config.frontendUrl);
});

app.get("/health", (_req, res) => {
  res.send("OK");
});

registerManifestRoute(app);
registerConfigureRoute(app);
registerGenerateLinkRoute(app);
registerCatalogRoute(app);

if (config.sentry.enabled) {
  setupSentryRequestHandler(app);
}

app.listen(config.port, async () => {
  console.log(`Server listening on port ${config.port}`);
  if (config.redis.enabled) {
    connectToRedis();
  }

  // if (process.env.NODE_ENV == "production") {
  // console.log("Publishing to central...");
  // try {
  // 	publishToCentral(
  // 		`https://${process.env.BACKEND_HOST}/manifest.json`
  // 	);
  // } catch (error) {
  // 	console.error("Failed to publish to central", error);
  // }
  // }
});
