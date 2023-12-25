import { Express } from "express";

import { decryptConfig } from "@/encryption";
import generateManifest from "@/generateManifest";
import { getSimkleUsername } from "@/simkl";

export default async function registerManifestRoute(app: Express) {
	app.get("/manifest.json", async (req, res) => {
		res.send(generateManifest("unconfigured", false));
	});

	app.get("/:config/manifest.json", async (req, res) => {
		const config = decryptConfig(req.params.config);
		if (!config.simklToken) {
			res.status(400).send("Invalid config");
			return;
		}

		const username = await getSimkleUsername(config.simklToken);

		const manifest = generateManifest(username);

		res.send(manifest);

		console.log(`Generated manifest for ${username}`);
	});
}
