const RPDB_API = "https://api.ratingposterdb.com";

export function getRPDBPosterUrl(
  tmdbId: string,
  mediaType: "movie" | "series",
): string {
  return `${RPDB_API}/${process.env.RPDB_API_KEY}/tmdb/poster-default/${mediaType}-${tmdbId}.jpg`;
}
