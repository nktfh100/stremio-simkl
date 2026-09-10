export enum SortOption {
	RECENTLY_ADDED = 'Recently Added',
	LAST_WATCHED = 'Last Watched',
	MY_RATING = 'My Rating',
	YEAR = 'Year',
	TITLE = 'Title',
}

export const allSortOptions = Object.values(SortOption);

export enum CatalogType {
	MOVIE_PLAN_TO_WATCH = 'simkl-plan-to-watch-movie',
	MOVIE_COMPLETED = 'simkl-completed-movie',
	SERIES_WATCHING = 'simkl-watching',
	SERIES_PLAN_TO_WATCH = 'simkl-plan-to-watch-series',
	SERIES_COMPLETED = 'simkl-completed-series',
	ANIME_WATCHING = 'simkl-watching-anime',
	ANIME_PLAN_TO_WATCH = 'simkl-plan-to-watch-anime',
	ANIME_COMPLETED = 'simkl-completed-anime',
}

export const allCatalogs = Object.values(CatalogType);

export const defaultCatalogs = [
	CatalogType.MOVIE_PLAN_TO_WATCH,
	CatalogType.SERIES_WATCHING,
	CatalogType.SERIES_PLAN_TO_WATCH,
];

export const frontendCatalogNames: Record<CatalogType, string> = {
	[CatalogType.MOVIE_PLAN_TO_WATCH]: 'Movies Plan To Watch',
	[CatalogType.MOVIE_COMPLETED]: 'Movies Completed',
	[CatalogType.SERIES_WATCHING]: 'Series Watching',
	[CatalogType.SERIES_PLAN_TO_WATCH]: 'Series Plan To Watch',
	[CatalogType.SERIES_COMPLETED]: 'Series Completed',
	[CatalogType.ANIME_WATCHING]: 'Anime Watching',
	[CatalogType.ANIME_PLAN_TO_WATCH]: 'Anime Plan To Watch',
	[CatalogType.ANIME_COMPLETED]: 'Anime Completed',
};

export const catalogToInt = (catalog: CatalogType) => {
	return allCatalogs.indexOf(catalog);
};

export const catalogExtra = (catalog: CatalogType) => [
	{
		name: 'skip',
		isRequired: false,
	},
	{
		name: 'Sort',
		isRequired: false,
		options: catalog.includes('plan-to-watch')
			? [SortOption.RECENTLY_ADDED, SortOption.YEAR, SortOption.TITLE]
			: allSortOptions,
	},
];

export const catalogsData = {
	[CatalogType.MOVIE_PLAN_TO_WATCH]: {
		id: CatalogType.MOVIE_PLAN_TO_WATCH,
		type: 'movie',
		name: 'SIMKL Plan To Watch',
	},
	[CatalogType.MOVIE_COMPLETED]: {
		id: CatalogType.MOVIE_COMPLETED,
		type: 'movie',
		name: 'SIMKL Completed',
	},
	[CatalogType.SERIES_WATCHING]: {
		id: CatalogType.SERIES_WATCHING,
		type: 'series',
		name: 'SIMKL Watching',
	},
	[CatalogType.SERIES_PLAN_TO_WATCH]: {
		id: CatalogType.SERIES_PLAN_TO_WATCH,
		type: 'series',
		name: 'SIMKL Plan To Watch',
	},
	[CatalogType.SERIES_COMPLETED]: {
		id: CatalogType.SERIES_COMPLETED,
		type: 'series',
		name: 'SIMKL Completed',
	},
	[CatalogType.ANIME_WATCHING]: {
		id: CatalogType.ANIME_WATCHING,
		type: 'anime',
		name: 'SIMKL Watching',
	},
	[CatalogType.ANIME_PLAN_TO_WATCH]: {
		id: CatalogType.ANIME_PLAN_TO_WATCH,
		type: 'anime',
		name: 'SIMKL Plan To Watch',
	},
	[CatalogType.ANIME_COMPLETED]: {
		id: CatalogType.ANIME_COMPLETED,
		type: 'anime',
		name: 'SIMKL Completed',
	},
};
