import {
	CleanedTMDBMovie,
	CleanedTMDBShow,
	TMDBMovieResponse,
	TMDBShowResponse,
} from "@/types";

export function generatePosterUrl(poster: string): string {
	return `https://simkl.in/posters/${poster}_m.webp`;
}

export function slugify(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "_");
}

export function createReleaseInfo(
	type: "movie" | "series",
	tmdbMeta: CleanedTMDBMovie | CleanedTMDBShow | null
): string {
	if (!tmdbMeta) return "";

	if (type === "movie") {
		return extractYear((tmdbMeta as CleanedTMDBMovie).release_date);
	}

	const firstAirDate = (tmdbMeta as CleanedTMDBShow).first_air_date;
	const lastAirDate = (tmdbMeta as CleanedTMDBShow).last_air_date;

	if (!firstAirDate) return "";

	const firstAirYear = extractYear(firstAirDate);
	const lastAirYear = extractYear(lastAirDate);

	if ((tmdbMeta as CleanedTMDBShow).in_production) {
		return firstAirYear + " - Present";
	}

	if (firstAirYear === lastAirYear) {
		return firstAirYear;
	}

	return `${firstAirYear} - ${lastAirYear}`;
}

function extractYear(releaseInfo: string): string {
	return releaseInfo.split("-")[0];
}

export function cleanTMDBShowMeta(meta: TMDBShowResponse): CleanedTMDBShow {
	return {
		id: meta.id,
		first_air_date: meta.first_air_date,
		last_air_date: meta.last_air_date,
		genres: meta.genres,
		in_production: meta.in_production,
		overview: meta.overview,
		status: meta.status,
	};
}

export function cleanTMDBMovieMeta(meta: TMDBMovieResponse): CleanedTMDBMovie {
	return {
		id: meta.id,
		release_date: meta.release_date,
		genres: meta.genres,
		overview: meta.overview,
	};
}
