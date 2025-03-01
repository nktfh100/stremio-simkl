import { Express, Response } from "express";

import { generateCatalog } from "@/controllers/catalogController";
import { getConfig } from "@/lib/config";
import { StremioMediaType, validateStremioMediaType } from "@/lib/mediaTypes";

// Cache for 5 minute
const setCacheControl = (res: Response) => {
  if (getConfig().env === "production") {
    res.set("Cache-Control", `public, max-age=${60 * 5}`);
  }
};

export default async function registerCatalogRoute(app: Express) {
  app.get("/:config/catalog/:type/:list/:skip.json", async (req, res) => {
    try {
      const skipStr = req.params.skip; // "skip=25"
      const skipNumParsed = parseInt(skipStr.split("=")[1]);

      if (!validateStremioMediaType(req.params.type)) {
        res.status(400).send({ error: "Invalid list type" });
        return;
      }

      const stremioItems = await generateCatalog(
        req.params.config,
        req.params.type as StremioMediaType,
        req.params.list,
        skipNumParsed,
        50,
      );

      setCacheControl(res);

      res.send({
        metas: stremioItems,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.get("/:config/catalog/:type/:list.json", async (req, res) => {
    try {
      if (!validateStremioMediaType(req.params.type)) {
        res.status(400).send({ error: "Invalid list type" });
        return;
      }

      const stremioItems = await generateCatalog(
        req.params.config,
        req.params.type as StremioMediaType,
        req.params.list,
        0,
        50,
      );

      setCacheControl(res);

      res.send({
        metas: stremioItems,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
}
