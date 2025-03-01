import { decryptConfig } from "@/encryption";
import { getConfig } from "@/lib/config";
import {
  StremioMediaType,
  convertStremioMediaTypeToSimkl,
} from "@/lib/mediaTypes";
import { generateRPDBPosterUrl, mediaHasRPDBPoster } from "@/rpdb";
import { getSimklUserWatchList } from "@/simkl";
import { getTMDBMeta } from "@/tmdb";
import { SimklMovie, SimklShow } from "@/types";
import { createReleaseInfo, generatePosterUrl } from "@/utils";

export type SimklCatalogItem = {
  id: string;
  type: StremioMediaType;
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
  stremioMediaType: StremioMediaType,
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

  const simklMediaType = convertStremioMediaTypeToSimkl(stremioMediaType);
  if (!simklMediaType) {
    return {
      status: 400,
      error: "Invalid media type",
    };
  }

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
    simklMediaType,
    listType,
  );

  if (!userHistory) {
    return {
      status: 500,
      error: "Error fetching user history",
    };
  }

  let items = userHistory[simklMediaType];
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
      stremioMediaType == StremioMediaType.Series &&
      listType == "watching" &&
      simklItem.watched_episodes_count != 0 &&
      !(simklItem as SimklShow).next_to_watch
    ) {
      continue;
    }

    const tmdbMeta = itemMeta.ids.tmdb
      ? await getTMDBMeta(itemMeta.ids.tmdb, stremioMediaType)
      : null;

    const showNextEpisodeText =
      (stremioMediaType == StremioMediaType.Series ||
        stremioMediaType == StremioMediaType.Anime) &&
      listType == "watching" &&
      (simklItem as SimklShow).next_to_watch;
    const nextEpisodeDescription = showNextEpisodeText
      ? `Next episode to watch: ${(simklItem as SimklShow).next_to_watch}\n\n`
      : "";

    const overview = tmdbMeta ? tmdbMeta.overview : "";
    const tmdbCredit = tmdbMeta ? "\n\nData by TMDB." : "";

    const unsupportedText =
      stremioMediaType == StremioMediaType.Anime && !itemMeta.ids.imdb
        ? "This item is not supported.\nPlease add the base show to your list (season 1)."
        : "";

    const description = `${nextEpisodeDescription}${overview}${tmdbCredit}${unsupportedText}`;

    const genres = tmdbMeta ? tmdbMeta.genres.map((genre) => genre.name) : [];

    const posterUrl =
      getConfig().rpdb.enabled && mediaHasRPDBPoster(stremioMediaType, tmdbMeta)
        ? generateRPDBPosterUrl(itemMeta.ids.imdb)
        : generatePosterUrl(itemMeta.poster);

    stremioItems.push({
      id: itemMeta.ids.imdb,
      type:
        stremioMediaType == StremioMediaType.Anime
          ? StremioMediaType.Series
          : stremioMediaType,
      name: itemMeta.title,
      poster: posterUrl,
      description,
      links: [
        {
          name: "Simkl",
          category: "Simkl",
          url: `https://simkl.com/${stremioMediaType == StremioMediaType.Movie ? "movies" : stremioMediaType == StremioMediaType.Anime ? "anime" : "tv"}/${
            itemMeta.ids.simkl
          }`,
        },
      ],
      genres,
      releaseInfo: createReleaseInfo(stremioMediaType, tmdbMeta),
    });
  }

  return stremioItems;
};
