import { getConfig } from "./lib/config";
import { StremioMediaType } from "./lib/mediaTypes";
import { CleanedTMDBMovie, CleanedTMDBShow } from "./types";

const RPDB_API = "https://api.ratingposterdb.com";

export function generateRPDBPosterUrl(imdbId: string): string {
  return `${RPDB_API}/${getConfig().rpdb.apiKey}/imdb/poster-default/${imdbId}.jpg`;
}

// RPDB only has released movies and series
export function mediaHasRPDBPoster(
  mediaType: StremioMediaType,
  tmdbMeta: CleanedTMDBMovie | CleanedTMDBShow | null,
): boolean {
  if (mediaType == StremioMediaType.Anime) return false;

  if (!tmdbMeta) return false;

  if (tmdbMeta.status == "Released") return true;

  if (tmdbMeta.status == "In Production") return false;

  if (mediaType == "series" && (tmdbMeta as CleanedTMDBShow)?.last_air_date) {
    return true;
  }

  return false;
}
