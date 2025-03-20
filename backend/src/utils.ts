import {
  CleanedTMDBMovie,
  CleanedTMDBShow,
  TMDBMovieResponse,
  TMDBShowResponse,
} from "@/types";
import { CatalogType, allCatalogs, defaultCatalogs } from "@shared/catalogs";
import { StremioMediaType } from "./lib/mediaTypes";

const simklCacheUrl = "https://wsrv.nl/?url=https://simkl.in";
export function generatePosterUrl(poster: string): string {
  if (!poster) {
    return `${simklCacheUrl}/poster_no_pic.png`;
  }

  return `${simklCacheUrl}/posters/${poster}_m.webp`;
}

export function slugify(str: string | undefined): string {
  if (!str) return "";

  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "_");
}

export function createReleaseInfo(
  mediaType: StremioMediaType,
  tmdbMeta: CleanedTMDBMovie | CleanedTMDBShow | null,
): string {
  if (!tmdbMeta) return "";

  if (mediaType === StremioMediaType.Movie) {
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
  if (!releaseInfo) return "";

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
    status: meta.status,
  };
}

export function validateCatalogs(
  catalogs: string[] | undefined,
): CatalogType[] {
  if (!catalogs) return defaultCatalogs;

  return catalogs.filter((catalog) =>
    allCatalogs.includes(catalog as any),
  ) as CatalogType[];
}
