import { Express, Response } from "express";

import { generateCatalog } from "@/controllers/catalogController";

// Cache for 5 minute
const setCacheControl = (res: Response) => {
	if (process.env.NODE_ENV == "production") {
		res.set("Cache-Control", `public, max-age=${60 * 5}`);
	}
};

export default async function registerCatalogRoute(app: Express) {
	app.get("/:config/catalog/:type/:list/:skip.json", async (req, res) => {
		const skipStr = req.params.skip; // "skip=25"
		const skipNumParsed = parseInt(skipStr.split("=")[1]);

		const stremioItems = await generateCatalog(
			req.params.config,
			req.params.type,
			req.params.list,
			skipNumParsed,
			50
		);

		setCacheControl(res);

		res.send({
			metas: stremioItems,
		});
	});

	app.get("/:config/catalog/:type/:list.json", async (req, res) => {
		const stremioItems = await generateCatalog(
			req.params.config,
			req.params.type,
			req.params.list,
			0,
			50
		);

		setCacheControl(res);

		res.send({
			metas: stremioItems,
		});
	});
}
