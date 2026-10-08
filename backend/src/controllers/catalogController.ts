import { decryptConfig } from '@/encryption';
import { hashToken, markUserActive } from '@/lib/activeUsers';
import { getConfig } from '@/lib/config';
import { getLogger } from '@/lib/requestContext';
import {
	SimklAnimeType,
	StremioMediaType,
	convertStremioMediaTypeToSimkl,
} from '@/lib/mediaTypes';
import { generateRPDBPosterUrl, mediaHasRPDBPoster } from '@/rpdb';
import { getSimklUserWatchList } from '@/simkl';
import { getTMDBMeta } from '@/tmdb';
import { SimklMovie, SimklShow } from '@/types';
import { createReleaseInfo, generatePosterUrl } from '@/utils';
import { SortOption, defaultCatalogSort } from '@shared/catalogs';

type SimklItem = SimklMovie | SimklShow;

const getItemMeta = (item: SimklItem) =>
	(item as SimklMovie).movie || (item as SimklShow).show;

const toTimestamp = (date: null | string) =>
	date ? new Date(date).getTime() : 0;

type Comparator = (a: SimklItem, b: SimklItem) => number;

const byTitle: Comparator = (a, b) =>
	(getItemMeta(a)?.title || '').localeCompare(getItemMeta(b)?.title || '');

const titleFallback =
	(compare: Comparator): Comparator =>
	(a, b) =>
		compare(a, b) || byTitle(a, b);

const sortComparators: Record<SortOption, Comparator> = {
	[SortOption.RECENTLY_ADDED]: titleFallback(
		(a, b) =>
			toTimestamp(b.added_to_watchlist_at) -
			toTimestamp(a.added_to_watchlist_at),
	),
	[SortOption.LAST_WATCHED]: titleFallback(
		(a, b) => toTimestamp(b.last_watched_at) - toTimestamp(a.last_watched_at),
	),
	[SortOption.MY_RATING]: titleFallback(
		(a, b) => (b.user_rating || 0) - (a.user_rating || 0),
	),
	[SortOption.YEAR]: titleFallback(
		(a, b) => (getItemMeta(b)?.year || 0) - (getItemMeta(a)?.year || 0),
	),
	[SortOption.TITLE]: byTitle,
};

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
	sort: SortOption | null,
): Promise<
	| SimklCatalogItem[]
	| {
			status: number;
			error: string;
	  }
> => {
	getLogger('catalog').debug(
		{ catalog: catalogName, sort },
		'Generating catalog',
	);
	const decryptedConfig = decryptConfig(config);
	if (!decryptedConfig.simklToken) {
		return {
			status: 400,
			error: 'Invalid config',
		};
	}

	markUserActive(hashToken(decryptedConfig.simklToken));

	const simklMediaType = convertStremioMediaTypeToSimkl(stremioMediaType);
	if (!simklMediaType) {
		return {
			status: 400,
			error: 'Invalid media type',
		};
	}

	const listType = (() => {
		switch (catalogName.split('-')[1]) {
			case 'plan':
				return 'plantowatch';
			case 'watching':
				return 'watching';
			case 'completed':
				return 'completed';
			default:
				return 'watching';
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
			error: 'Error fetching user history',
		};
	}

	const allItems: SimklItem[] = userHistory[simklMediaType] || [];

	const stremioItems: SimklCatalogItem[] = [];

	const defaultSort =
		decryptedConfig.selectedCatalogs.find(
			({ catalog }) => catalog === catalogName,
		)?.sort ?? defaultCatalogSort(catalogName);

	// Dont display shows that the user finished watching
	const isFinishedShow = (item: SimklItem) =>
		stremioMediaType == StremioMediaType.Series &&
		listType == 'watching' &&
		item.watched_episodes_count != 0 &&
		!(item as SimklShow).next_to_watch;

	const items = allItems
		.filter((item) => !isFinishedShow(item))
		.sort(sortComparators[sort || defaultSort])
		.slice(skip, skip + maxItems);

	for (const simklItem of items) {
		const itemMeta =
			(simklItem as SimklMovie).movie || (simklItem as SimklShow).show;
		const resolvedType =
			stremioMediaType === StremioMediaType.Anime
				? (simklItem as SimklShow).anime_type === SimklAnimeType.Movie
					? StremioMediaType.Movie
					: StremioMediaType.Series
				: stremioMediaType;

		const tmdbMeta = itemMeta.ids.tmdb
			? await getTMDBMeta(itemMeta.ids.tmdb, resolvedType)
			: null;

		const showNextEpisodeText =
			resolvedType == StremioMediaType.Series &&
			listType == 'watching' &&
			(simklItem as SimklShow).next_to_watch;
		const nextEpisodeDescription = showNextEpisodeText
			? `Next episode to watch: ${(simklItem as SimklShow).next_to_watch}\n\n`
			: '';

		const overview = tmdbMeta ? tmdbMeta.overview : '';
		const tmdbCredit = tmdbMeta ? '\n\nData by TMDB.' : '';

		const unsupportedText =
			stremioMediaType == StremioMediaType.Anime && !itemMeta.ids.imdb
				? 'This item is not supported.\nPlease add the base show to your list (season 1).'
				: '';

		const description = `${nextEpisodeDescription}${overview}${tmdbCredit}${unsupportedText}`;

		const genres = tmdbMeta ? tmdbMeta.genres.map((genre) => genre.name) : [];

		const posterUrl =
			getConfig().rpdb.enabled && mediaHasRPDBPoster(stremioMediaType, tmdbMeta)
				? generateRPDBPosterUrl(itemMeta.ids.imdb)
				: generatePosterUrl(itemMeta.poster);

		stremioItems.push({
			id: itemMeta.ids.imdb,
			type: resolvedType,
			name: itemMeta.title,
			poster: posterUrl,
			description,
			links: [
				{
					name: 'Simkl',
					category: 'Simkl',
					url: `https://simkl.com/${stremioMediaType == StremioMediaType.Movie ? 'movies' : stremioMediaType == StremioMediaType.Anime ? 'anime' : 'tv'}/${
						itemMeta.ids.simkl
					}`,
				},
			],
			genres,
			releaseInfo: createReleaseInfo(resolvedType, tmdbMeta),
		});
	}

	return stremioItems;
};
