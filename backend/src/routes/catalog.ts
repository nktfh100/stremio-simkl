import { Express } from "express";

import { decryptConfig } from "@/encryption";
import { getRPDBPosterUrl } from "@/rpdb";
import { getSimklUserWatchList } from "@/simkl";
import { getTMDBMovieMeta, getTMDBShowMeta } from "@/tmdb";
import { SimklMovie, SimklShow } from "@/types";
import { createReleaseInfo, generatePosterUrl } from "@/utils";

export default async function registerCatalogRoute(app: Express) {
	app.get("/:config/catalog/:type/:list.json", async (req, res) => {
		console.log("Catalog request", req.params.list);

		const config = decryptConfig(req.params.config);
		if (!config.simklToken) {
			return res.status(400).send("Invalid config");
		}

		const stremioType = req.params.type as "series" | "movie";
		const simklType = stremioType == "series" ? "shows" : "movies";
		const isPlanToWatch = req.params.list.includes("plan-to-watch");

		const listType =
			isPlanToWatch || stremioType == "movie"
				? "plantowatch"
				: "watching";

		const userHistory = await getSimklUserWatchList(
			config.simklToken,
			simklType,
			listType
		);

		if (!userHistory) {
			return res.status(500).send("Error fetching user history");
		}

		const items = userHistory[simklType];
		if (!items || items.length == 0) {
			return res.send({
				metas: [],
			});
		}
		const stremioItems: any[] = [];

		for (const simklItem of items) {
			const itemMeta =
				(simklItem as SimklMovie).movie ||
				(simklItem as SimklShow).show;

			// Dont display shows that the user finished watching
			if (
				stremioType == "series" &&
				!(simklItem as SimklShow).next_to_watch
			) {
				continue;
			}

			const tmdbMeta =
				stremioType == "series"
					? await getTMDBShowMeta(itemMeta.ids.tmdb)
					: await getTMDBMovieMeta(itemMeta.ids.tmdb);

			const showNextEpisodeText =
				stremioType == "series" && !isPlanToWatch;
			const nextEpisodeDescription = showNextEpisodeText
				? `Next episode to watch: ${
						(simklItem as SimklShow).next_to_watch
				  }\n\n`
				: "";

			const overview = tmdbMeta ? tmdbMeta.overview : "";
			const tmdbCredit = tmdbMeta ? "\n\nData by TMDB." : "";

			const description = `${nextEpisodeDescription}${overview}${tmdbCredit}`;

			const genres = tmdbMeta
				? tmdbMeta.genres.map((genre) => genre.name)
				: [];

			let posterUrl = generatePosterUrl(itemMeta.poster);

			if (process.env.USE_RPDB) {
				// Currently RPDB only has released movies and series
				if (
					(stremioType == "movie" &&
						tmdbMeta?.status == "Released") ||
					(stremioType == "series" &&
						tmdbMeta?.status != "In Production")
				) {
					posterUrl = getRPDBPosterUrl(itemMeta.ids.tmdb);
				}
			}

			stremioItems.push({
				id: itemMeta.ids.imdb,
				type: stremioType,
				name: itemMeta.title,
				poster: posterUrl,
				description,
				links: [
					{
						name: "Simkl",
						category: "Simkl",
						url: `https://simkl.com/${
							stremioType == "movie" ? "movies" : "tv"
						}/${itemMeta.ids.simkl}`,
					},
				],
				genres,
				releaseInfo: createReleaseInfo(stremioType, tmdbMeta),
			});
		}

		// Cache for 5 minute
		if (process.env.NODE_ENV == "production") {
			res.set("Cache-Control", `public, max-age=${60 * 5}`);
		}

		res.send({
			metas: stremioItems,
		});
	});
}
