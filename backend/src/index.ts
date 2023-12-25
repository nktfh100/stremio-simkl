import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { publishToCentral } from "stremio-addon-sdk";

import { connectToRedis } from "@/cache";
import { initEncryption } from "@/encryption";
import registerCatalogRoute from "@/routes/catalog";
import registerGenerateLinkRoute from "@/routes/generateLink";
import registerManifestRoute from "@/routes/manifest";

import registerConfigureRoute from "./routes/configure";

dotenv.config();

initEncryption();

const PORT = parseInt(process.env.PORT || "43001");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	if (process.env.NODE_ENV == "production") {
		res.set("Cache-Control", `public, max-age=${60}`); // 1 minute
	}
	next();
});

app.get("/", (req, res) => {
	res.redirect(process.env.FRONTEND_URL!);
});

registerManifestRoute(app);
registerConfigureRoute(app);
registerGenerateLinkRoute(app);
registerCatalogRoute(app);

app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`);
	connectToRedis();

	if (process.env.NODE_ENV == "production") {
		publishToCentral(`https://${process.env.BACKEND_URI}/manifest.json`);
	}
});
