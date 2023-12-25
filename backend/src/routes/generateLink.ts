import { Express } from "express";

import { generateEncryptedConfig } from "@/encryption";
import { getSimklAccessToken } from "@/simkl";

export default async function registerGenerateLinkRoute(app: Express) {
	app.post("/gen-link", async (req, res) => {
		const data = req.body as { code: string };

		if (!data || !data.code) {
			res.status(400).send({ error: "No data provided!" });
		}

		const simklToken = await getSimklAccessToken(data.code);
		if (!simklToken) {
			res.status(400).send({ error: "Invalid simkl code!" });
			return;
		}

		const encryptedConfig = generateEncryptedConfig(simklToken);

		res.send({
			link: `stremio://${process.env.BACKEND_URI}/${encryptedConfig}/manifest.json`,
		});

		console.log(`Generated install link`);
	});
}
