import axios from 'axios';

import getClient from '@/cache';
import { CleanedTMDBMovie, CleanedTMDBShow } from '@/types';
import { cleanTMDBMovieMeta, cleanTMDBShowMeta } from '@/utils';

const TMDB_API = "https://api.themoviedb.org/3";

export async function getTMDBMovieMeta(
	tmdbId: string
): Promise<CleanedTMDBMovie | null> {
	try {
		const cached = await getCachedTMDBMovieMeta(tmdbId);
		if (cached) return cached;

		const result = await axios.get(`${TMDB_API}/movie/${tmdbId}`, {
			headers: {
				Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
			},
		});

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
	tmdbId: string
): Promise<CleanedTMDBShow | null> {
	try {
		const cached = await getCachedTMDBShowMeta(tmdbId);
		if (cached) return cached;

		const result = await axios.get(`${TMDB_API}/tv/${tmdbId}`, {
			headers: {
				Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
			},
		});

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
	tmdbId: string
): Promise<CleanedTMDBMovie | null> {
	try {
		if(!tmdbId) return null;

		const dataStr = await getClient().get(tmdbId);
		if (!dataStr) return null;

		const data = JSON.parse(dataStr);
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function getCachedTMDBShowMeta(
	tmdbId: string
): Promise<CleanedTMDBShow | null> {
	try {
		if(!tmdbId) return null;

		const dataStr = await getClient().get(tmdbId);
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
	meta: CleanedTMDBMovie
): Promise<void> {
	try {
		await getClient().set(tmdbId, JSON.stringify(meta), {
			EX: cacheTTL,
		});
	} catch (error) {
		console.error(error);
	}
}

async function cacheTMDBShowMeta(
	tmdbId: string,
	meta: CleanedTMDBShow
): Promise<void> {
	try {
		await getClient().set(tmdbId, JSON.stringify(meta), {
			EX: cacheTTL,
		});
	} catch (error) {
		console.error(error);
	}
}
