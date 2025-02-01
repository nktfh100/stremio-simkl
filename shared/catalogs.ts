const catalogExtra = [
  {
    name: "skip",
    isRequired: false,
  },
];

export enum CatalogType {
  MOVIE_PLAN_TO_WATCH = "simkl-plan-to-watch-movie",
  MOVIE_COMPLETED = "simkl-completed-movie",
  SERIES_WATCHING = "simkl-watching",
  SERIES_PLAN_TO_WATCH = "simkl-plan-to-watch-series",
  SERIES_COMPLETED = "simkl-completed-series",
}

export const allCatalogs = Object.values(CatalogType);

export const defaultCatalogs = [
  CatalogType.MOVIE_PLAN_TO_WATCH,
  CatalogType.SERIES_WATCHING,
  CatalogType.SERIES_PLAN_TO_WATCH,
];

export const frontendCatalogNames: Record<CatalogType, string> = {
  [CatalogType.MOVIE_PLAN_TO_WATCH]: "Movies Plan To Watch",
  [CatalogType.MOVIE_COMPLETED]: "Movies Completed",
  [CatalogType.SERIES_WATCHING]: "Series Watching",
  [CatalogType.SERIES_PLAN_TO_WATCH]: "Series Plan To Watch",
  [CatalogType.SERIES_COMPLETED]: "Series Completed",
};

export const catalogToInt = (catalog: CatalogType) => {
  return allCatalogs.indexOf(catalog);
};

export const catalogsData = {
  [CatalogType.MOVIE_PLAN_TO_WATCH]: {
    id: CatalogType.MOVIE_PLAN_TO_WATCH,
    type: "movie",
    name: "SIMKL Plan To Watch",
    extra: catalogExtra,
  },
  [CatalogType.MOVIE_COMPLETED]: {
    id: CatalogType.MOVIE_COMPLETED,
    type: "movie",
    name: "SIMKL Completed",
    extra: catalogExtra,
  },
  [CatalogType.SERIES_WATCHING]: {
    id: CatalogType.SERIES_WATCHING,
    type: "series",
    name: "SIMKL Watching",
    extra: catalogExtra,
  },
  [CatalogType.SERIES_PLAN_TO_WATCH]: {
    id: CatalogType.SERIES_PLAN_TO_WATCH,
    type: "series",
    name: "SIMKL Plan To Watch",
    extra: catalogExtra,
  },
  [CatalogType.SERIES_COMPLETED]: {
    id: CatalogType.SERIES_COMPLETED,
    type: "series",
    name: "SIMKL Completed",
    extra: catalogExtra,
  },
};
