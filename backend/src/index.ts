import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectToRedis } from "@/cache";
import { initEncryption } from "@/encryption";
import registerCatalogRoute from "@/routes/catalog";
import registerGenerateLinkRoute from "@/routes/generateLink";
import registerManifestRoute from "@/routes/manifest";

import registerConfigureRoute from "./routes/configure";
import { initMetrics, metricsEndpoint, metricsMiddleware } from "./metrics";

// import { publishToCentral } from "stremio-addon-sdk";
import { initSentry } from "./sentry";

dotenv.config();

if (process.env.ENABLE_SENTRY) {
  initSentry();
}

initEncryption();

const PORT = parseInt(process.env.PORT || "43001");

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.ENABLE_METRICS) {
  initMetrics();
  app.use(metricsMiddleware);
  app.get("/metrics", metricsEndpoint);
}

app.get("/", (_req, res) => {
  res.redirect(process.env.FRONTEND_URL!);
});

app.get("/health", (_req, res) => {
  res.send("OK");
});

registerManifestRoute(app);
registerConfigureRoute(app);
registerGenerateLinkRoute(app);
registerCatalogRoute(app);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  if (!process.env.DISABLE_REDIS) {
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
