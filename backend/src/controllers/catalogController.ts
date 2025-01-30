import { decryptConfig } from "@/encryption";
import { getRPDBPosterUrl } from "@/rpdb";
import { getSimklUserWatchList } from "@/simkl";
import { getTMDBMovieMeta, getTMDBShowMeta } from "@/tmdb";
import { SimklMovie, SimklShow } from "@/types";
import { createReleaseInfo, generatePosterUrl } from "@/utils";

export type SimklCatalogItem = {
  id: string;
  type: "movie" | "series";
  name: string;
  poster: string;
  description: string;
  links: {
    name: string;
    category: string;
    url: string;
  }[];
  genres: string[];
  releaseInfo: string;
};

export const generateCatalog = async (
  config: string,
  mediaType: string,
  catalogName: string,
  skip: number,
  maxItems: number,
): Promise<
  | SimklCatalogItem[]
  | {
      status: number;
      error: string;
    }
> => {
  console.log("Generating catalog", catalogName);
  const decryptedConfig = decryptConfig(config);
  if (!decryptedConfig.simklToken) {
    return {
      status: 400,
      error: "Invalid config",
    };
  }

  const stremioType = mediaType as "series" | "movie";
  const simklType = stremioType == "series" ? "shows" : "movies";

  const listType = (() => {
    switch (catalogName.split("-")[1]) {
      case "plan":
        return "plantowatch";
      case "watching":
        return "watching";
      case "completed":
        return "completed";
      default:
        return "watching";
    }
  })();

  const userHistory = await getSimklUserWatchList(
    decryptedConfig.simklToken,
    simklType,
    listType,
  );

  if (!userHistory) {
    return {
      status: 500,
      error: "Error fetching user history",
    };
  }

  let items = userHistory[simklType];
  if (!items || items.length == 0) {
    return [];
  }

  const stremioItems: SimklCatalogItem[] = [];

  if (listType == "plantowatch") {
    items.sort((a, b) => {
      const yearA =
        (a as SimklShow).show?.year || (a as SimklMovie).movie?.year || 0;
      const yearB =
        (b as SimklShow).show?.year || (b as SimklMovie).movie?.year || 0;
      return yearB - yearA;
    });
  } else {
    items.sort(
      (a, b) =>
        new Date(b.last_watched_at!).getTime() -
        new Date(a.last_watched_at!).getTime(),
    );
  }

  // Skip items
  items = items.slice(skip);

  // Limit items
  items = items.slice(0, maxItems);

  for (const simklItem of items) {
    const itemMeta =
      (simklItem as SimklMovie).movie || (simklItem as SimklShow).show;

    // Dont display shows that the user finished watching
    if (
      stremioType == "series" &&
      listType == "watching" &&
      !(simklItem as SimklShow).next_to_watch
    ) {
      continue;
    }

    const tmdbMeta =
      stremioType == "series"
        ? await getTMDBShowMeta(itemMeta.ids.tmdb)
        : await getTMDBMovieMeta(itemMeta.ids.tmdb);

    const showNextEpisodeText =
      stremioType == "series" && listType == "watching";
    const nextEpisodeDescription = showNextEpisodeText
      ? `Next episode to watch: ${(simklItem as SimklShow).next_to_watch}\n\n`
      : "";

    const overview = tmdbMeta ? tmdbMeta.overview : "";
    const tmdbCredit = tmdbMeta ? "\n\nData by TMDB." : "";

    const description = `${nextEpisodeDescription}${overview}${tmdbCredit}`;

    const genres = tmdbMeta ? tmdbMeta.genres.map((genre) => genre.name) : [];

    let posterUrl = generatePosterUrl(itemMeta.poster);

    if (process.env.USE_RPDB) {
      // Currently RPDB only has released movies and series
      if (
        (stremioType == "movie" && tmdbMeta?.status == "Released") ||
        (stremioType == "series" && tmdbMeta?.status != "In Production")
      ) {
        posterUrl = getRPDBPosterUrl(itemMeta.ids.tmdb, stremioType);
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
          url: `https://simkl.com/${stremioType == "movie" ? "movies" : "tv"}/${
            itemMeta.ids.simkl
          }`,
        },
      ],
      genres,
      releaseInfo: createReleaseInfo(stremioType, tmdbMeta),
    });
  }

  return stremioItems;
};
