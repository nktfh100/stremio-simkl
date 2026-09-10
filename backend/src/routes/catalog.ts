import { Express, Response } from "express";

import { generateCatalog } from "@/controllers/catalogController";
import { getConfig } from "@/lib/config";
import { StremioMediaType, validateStremioMediaType } from "@/lib/mediaTypes";
import { parseSortOption } from "@/utils";

// Cache for 5 minute
const setCacheControl = (res: Response) => {
  if (getConfig().env === "production") {
    res.set("Cache-Control", `public, max-age=${60 * 5}`);
  }
};

export default async function registerCatalogRoute(app: Express) {
  app.get("/:config/catalog/:type/:list/:extra?.json", async (req, res) => {
    try {
      if (!validateStremioMediaType(req.params.type)) {
        res.status(400).send({ error: "Invalid list type" });
        return;
      }

      const extra = new URLSearchParams(req.params.extra);

      const stremioItems = await generateCatalog(
        req.params.config,
        req.params.type as StremioMediaType,
        req.params.list,
        Math.max(0, parseInt(extra.get("skip") || "0") || 0),
        50,
        parseSortOption(extra.get("Sort")),
      );

      if (!Array.isArray(stremioItems)) {
        res.status(stremioItems.status).send({ error: stremioItems.error });
        return;
      }

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
