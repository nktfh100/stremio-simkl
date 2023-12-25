import { slugify } from "@/utils";

export default function generateManifest(
	user: string,
	configured: boolean = true
) {
	let description = `Display your Simkl watch list in Stremio, by @nktfh100`;

	if (configured) {
		description += ` (SIMKL user - ${user})`;
	}

	let id = "com.nktfh100.stremiosimkl";

	if (configured) {
		id += "." + slugify(user);
	}

	return {
		id,
		version: "0.1.1",
		name: "Stremio Simkl",
		description,
		logo: "https://eu.simkl.in/img_favicon/v2/favicon-192x192.png",
		catalogs: [
			{
				id: "simkl-plan-to-watch-movie",
				type: "movie",
				name: "SIMKL Plan To Watch",
			},
			{
				id: "simkl-watching",
				type: "series",
				name: "SIMKL Watching",
			},
			{
				id: "simkl-plan-to-watch-series",
				type: "series",
				name: "SIMKL Plan To Watch",
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
