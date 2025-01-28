import { slugify } from "@/utils";

const catalogExtra = [
	{
		name: "skip",
		isRequired: false,
	},
];

export default function generateManifest(
	user: string,
	configured: boolean = true
) {
	let description = `Unofficial addon to display your Simkl Watchlists in Stremio, by @nktfh100`;

	if (!user) {
		user = "unknown";
	}

	if (configured) {
		description += ` (SIMKL user - ${user})`;
	}

	let id = "com.nktfh100.stremiosimkl";

	if (configured) {
		id += "." + slugify(user);
	}

	return {
		id,
		version: "0.2.0",
		name: "Simkl Watchlists",
		description,
		logo: "https://eu.simkl.in/img_favicon/v2/favicon-192x192.png",
		catalogs: [
			{
				id: "simkl-plan-to-watch-movie",
				type: "movie",
				name: "SIMKL Plan To Watch",
				extra: catalogExtra,
			},
			{
				id: "simkl-watching",
				type: "series",
				name: "SIMKL Watching",
				extra: catalogExtra,
			},
			{
				id: "simkl-plan-to-watch-series",
				type: "series",
				name: "SIMKL Plan To Watch",
				extra: catalogExtra,
			},
			{
				id: "simkl-completed-series",
				type: "series",
				name: "SIMKL Completed",
				extra: catalogExtra,
			},
			{
				id: "simkl-completed-movie",
				type: "movie",
				name: "SIMKL Completed",
				extra: catalogExtra,
			},
		],
		resources: ["catalog"],
		types: ["movie", "series"],
		behaviorHints: {
			configurable: !configured,
			configurationRequired: !configured,
		},
	};
}
