import { Express, Response } from "express";

import { generateCatalog } from "@/controllers/catalogController";
import { getConfig } from "@/lib/config";

// Cache for 5 minute
const setCacheControl = (res: Response) => {
  if (getConfig().env) {
    res.set("Cache-Control", `public, max-age=${60 * 5}`);
  }
};

export default async function registerCatalogRoute(app: Express) {
  app.get("/:config/catalog/:type/:list/:skip.json", async (req, res) => {
    try {
      const skipStr = req.params.skip; // "skip=25"
      const skipNumParsed = parseInt(skipStr.split("=")[1]);

      const stremioItems = await generateCatalog(
        req.params.config,
        req.params.type,
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
      const stremioItems = await generateCatalog(
        req.params.config,
        req.params.type,
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
