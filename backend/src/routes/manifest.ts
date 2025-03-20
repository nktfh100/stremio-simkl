import { Express } from "express";

import { decryptConfig } from "@/encryption";
import generateManifest from "@/generateManifest";
import { getSimklUsername } from "@/simkl";
import { defaultCatalogs } from "@shared/catalogs";

export default async function registerManifestRoute(app: Express) {
  app.get("/manifest.json", async (_req, res) => {
    res.send(generateManifest("", defaultCatalogs, false));
  });

  app.get("/:config/manifest.json", async (req, res) => {
    const config = decryptConfig(req.params.config);
    if (!config.simklToken) {
      res.status(400).send("Invalid config");
      return;
    }

    const username = await getSimklUsername(config.simklToken);

    const manifest = generateManifest(username, config.selectedCatalogs);
    console.log(`Generated manifest for ${username}`);

    res.send(manifest);
  });
}
