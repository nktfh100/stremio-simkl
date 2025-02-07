export enum SimklMediaType {
  Movie = "movies",
  Show = "shows",
  Anime = "anime",
}

export enum StremioMediaType {
  Movie = "movie",
  Series = "series",
  Anime = "anime",
}

export const convertStremioMediaTypeToSimkl = (
  type: StremioMediaType,
): SimklMediaType | null => {
  switch (type) {
    case StremioMediaType.Movie:
      return SimklMediaType.Movie;
    case StremioMediaType.Series:
      return SimklMediaType.Show;
    case StremioMediaType.Anime:
      return SimklMediaType.Anime;
    default:
      return null;
  }
};

export const validateStremioMediaType = (type: string): boolean => {
  return Object.values(StremioMediaType).includes(type as StremioMediaType);
};
