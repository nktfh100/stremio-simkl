import axios from "axios";

import getClient from "@/cache";
import { CleanedTMDBMovie, CleanedTMDBShow } from "@/types";
import { cleanTMDBMovieMeta, cleanTMDBShowMeta } from "@/utils";
import { getConfig } from "./lib/config";
import { StremioMediaType } from "./lib/mediaTypes";

const TMDB_API = "https://api.themoviedb.org/3";

const tmdbAxios = axios.create({
  baseURL: TMDB_API,
  headers: {
    Authorization: `Bearer ${getConfig().tmdbApiKey}`,
  },
});

export async function getTMDBMeta(
  tmdbId: string,
  type: StremioMediaType,
): Promise<CleanedTMDBMovie | CleanedTMDBShow | null> {
  switch (type) {
    case StremioMediaType.Series:
    case String(StremioMediaType.Anime):
      return getTMDBShowMeta(tmdbId);
    case StremioMediaType.Movie:
      return getTMDBMovieMeta(tmdbId);
    default:
      return null;
  }
}

export async function getTMDBMovieMeta(
  tmdbId: string,
): Promise<CleanedTMDBMovie | null> {
  try {
    const cached = await getCachedTMDBMovieMeta(tmdbId);
    if (cached) return cached;

    const result = await tmdbAxios.get(`/movie/${tmdbId}`);

    const cleanedMeta = cleanTMDBMovieMeta(result.data);

    await cacheTMDBMovieMeta(tmdbId, cleanedMeta);

    return cleanedMeta;
  } catch (error: any) {
    console.error("TMDB MOVIE API ERROR", tmdbId);

    if (error.message) console.error(error.message);

    return null;
  }
}

export async function getTMDBShowMeta(
  tmdbId: string,
): Promise<CleanedTMDBShow | null> {
  try {
    const cached = await getCachedTMDBShowMeta(tmdbId);
    if (cached) return cached;

    const result = await tmdbAxios.get(`/tv/${tmdbId}`);

    const cleanedMeta = cleanTMDBShowMeta(result.data);

    await cacheTMDBShowMeta(tmdbId, cleanedMeta);

    return cleanedMeta;
  } catch (error: any) {
    console.error("TMDB SHOW API ERROR", tmdbId);

    if (error.message) console.error(error.message);

    return null;
  }
}

// 30 days
const cacheTTL = 60 * 60 * 24 * 30;

async function getCachedTMDBMovieMeta(
  tmdbId: string,
): Promise<CleanedTMDBMovie | null> {
  try {
    if (!tmdbId) return null;

    const redisClient = getClient();
    if (!redisClient) return null;

    const dataStr = await redisClient.get(tmdbId);
    if (!dataStr) return null;

    const data = JSON.parse(dataStr);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getCachedTMDBShowMeta(
  tmdbId: string,
): Promise<CleanedTMDBShow | null> {
  try {
    if (!tmdbId) return null;

    const redisClient = getClient();
    if (!redisClient) return null;

    const dataStr = await redisClient.get(tmdbId);
    if (!dataStr) return null;

    const data = JSON.parse(dataStr);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function cacheTMDBMovieMeta(
  tmdbId: string,
  meta: CleanedTMDBMovie,
): Promise<void> {
  try {
    const redisClient = getClient();
    if (!redisClient) return;

    await redisClient.set(tmdbId, JSON.stringify(meta), {
      EX: cacheTTL,
    });
  } catch (error) {
    console.error(error);
  }
}

async function cacheTMDBShowMeta(
  tmdbId: string,
  meta: CleanedTMDBShow,
): Promise<void> {
  try {
    const redisClient = getClient();
    if (!redisClient) return;

    await redisClient.set(tmdbId, JSON.stringify(meta), {
      EX: cacheTTL,
    });
  } catch (error) {
    console.error(error);
  }
}
