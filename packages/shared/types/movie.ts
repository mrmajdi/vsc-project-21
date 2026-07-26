/**
 * Shared TypeScript types for movie-related entities.
 * These interfaces are used across frontend and backend layers.
 */

export interface Genre {
  /** Unique identifier for the genre */
  id: number;
  /** Name of the genre (e.g., "Action", "Drama") */
  name: string;
}

/**
 * Movie entity representing a film or TV show.
 */
export interface Movie {
  /** Unique identifier (could be TMDB ID or UUID) */
  id: string;
  /** Primary title */
  title: string;
  /** Original title in its native language (optional) */
  originalTitle?: string;
  /** Brief plot summary */
  overview: string;
  /** Release date in ISO 8601 format (YYYY-MM-DD) */
  releaseDate: string;
  /** Path to poster image (relative to base URL) */
  posterPath?: string;
  /** Path to backdrop image (relative to base URL) */
  backdropPath?: string;
  /** Average vote rating (0-10) */
  voteAverage: number;
  /** Number of votes */
  voteCount: number;
  /** Popularity score */
  popularity: number;
  /** Associated genres */
  genres: Genre[];
  /** Runtime in minutes (optional) */
  runtime?: number;
  /** Short tagline (optional) */
  tagline?: string;
}

/**
 * User comment on a movie.
 */
export interface Comment {
  /** Unique identifier for the comment */
  id: string;
  /** Reference to the movie */
  movieId: string;
  /** Reference to the user who wrote the comment */
  userId: string;
  /** Comment content */
  content: string;
  /** Timestamp when the comment was created (ISO 8601) */
  createdAt: string;
  /** Timestamp when the comment was last updated (optional) */
  updatedAt?: string;
}

/**
 * User rating for a movie.
 */
export interface Rating {
  /** Unique identifier for the rating */
  id: string;
  /** Reference to the movie */
  movieId: string;
  /** Reference to the user who gave the rating */
  userId: string;
  /** Rating value (e.g., 0-10 or 1-5; adjust as needed) */
  value: number;
  /** Timestamp when the rating was created (ISO 8601) */
  createdAt: string;
  /** Timestamp when the rating was last updated (optional) */
  updatedAt?: string;
}