const RPDB_API = "https://api.ratingposterdb.com";

export function getRPDBPosterUrl(imdbId: string): string {
  return `${RPDB_API}/${process.env.RPDB_API_KEY}/imdb/poster-default/${imdbId}.jpg`;
}
