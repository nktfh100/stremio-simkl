export interface TMDBMovieResponse {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: null | {
		id: number;
		name: string;
		poster_path: string;
		backdrop_path: string;
	};
	budget: number;
	genres: {
		id: number;
		name: string;
	}[];
	homepage: string;
	id: number;
	imdb_id: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: {
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface TMDBShowEpisodeResponse {
	air_date: string;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string;
	season_number: number;
	vote_average: number;
}

export interface TMDBShowResponse {
	backdrop_path: string;
	created_by: string[];
	episode_run_time: number[];
	first_air_date: string;
	genres: { id: number; name: string }[];
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: TMDBShowEpisodeResponse;
	name: string;
	networks: { id: number; name: string }[];
	next_episode_to_air: TMDBShowEpisodeResponse;
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: { id: number; name: string }[];
	seasons: {
		air_date: string;
		episode_count: number;
		id: number;
		name: string;
		overview: string;
		poster_path: string;
		season_number: number;
		vote_average: number;
	}[];
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
}

export interface CleanedTMDBShow {
	id: number;
	first_air_date: string;
	last_air_date: string;
	genres: { id: number; name: string }[];
	in_production: boolean;
	overview: string;
	status: string;
}

export interface CleanedTMDBMovie {
	id: number;
	release_date: string;
	genres: { id: number; name: string }[];
	overview: string;
	status: string;
}

export interface SimklIds {
	simkl: number;
	slug: string;
	imdb: string;
	tvdbmslug: string;
	fb: string;
	instagram: string;
	tw: string;
	traktslug: string;
	letterslug: string;
	tmdb: string;
}

export interface SimklMeta {
	title: string;
	poster: string;
	year: number;
	ids: SimklIds;
}

export interface SimklShow {
	last_watched_at: string;
	status: string;
	user_rating: null | number;
	last_watched: string;
	next_to_watch: null | string;
	watched_episodes_count: number;
	total_episodes_count: number;
	not_aired_episodes_count: number;
	show: SimklMeta;
}

export interface SimklMovie {
	last_watched_at: null | string;
	status: string;
	user_rating: null | number;
	watched_episodes_count: number;
	total_episodes_count: number;
	not_aired_episodes_count: number;
	movie: SimklMeta;
}

export interface SimklHistoryResponse {
	movies?: SimklMovie[];
	shows?: SimklShow[];
}
