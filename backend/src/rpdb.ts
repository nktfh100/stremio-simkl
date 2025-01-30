import { CleanedTMDBMovie, CleanedTMDBShow } from "./types";

const RPDB_API = "https://api.ratingposterdb.com";

export function generateRPDBPosterUrl(imdbId: string): string {
  return `${RPDB_API}/${process.env.RPDB_API_KEY}/imdb/poster-default/${imdbId}.jpg`;
}

// RPDB only has released movies and series
export function mediaHasRPDBPoster(
  mediaType: "movie" | "series",
  tmdbMeta: CleanedTMDBMovie | CleanedTMDBShow | null,
): boolean {
  if (!tmdbMeta) return false;

  if (tmdbMeta.status == "Released") return true;

  if (tmdbMeta.status == "In Production") return false;

  if (mediaType == "series" && (tmdbMeta as CleanedTMDBShow)?.last_air_date) {
    return true;
  }

  return false;
}
