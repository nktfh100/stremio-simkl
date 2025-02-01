import { Express } from "express";

import { generateEncryptedConfig } from "@/encryption";
import { getSimklAccessToken } from "@/simkl";
import { validateCatalogs } from "@/utils";

export default async function registerGenerateLinkRoute(app: Express) {
  app.post("/gen-link", async (req, res) => {
    const data = req.body as { code: string; selectedCatalogs?: string[] };

    if (!data || !data.code) {
      res.status(400).send({ error: "No data provided!" });
    }

    const simklToken = await getSimklAccessToken(data.code);
    if (!simklToken) {
      res.status(400).send({ error: "Invalid simkl code!" });
      return;
    }

    const selectedCatalogs = validateCatalogs(data.selectedCatalogs);

    const encryptedConfig = generateEncryptedConfig(
      simklToken,
      selectedCatalogs,
    );

    res.send({
      link: `stremio://${process.env.BACKEND_HOST}/${encryptedConfig}/manifest.json`,
    });

    console.log(`Generated install link`);
  });
}
