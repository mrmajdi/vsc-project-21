/**
 * TypeScript interfaces for Series, Season, and Episode entities.
 * These interfaces are shared between frontend and backend.
 */

export interface Series {
  /** Unique identifier */
  id: string;
  /** Title of the series */
  title: string;
  /** Short description or tagline */
  description?: string;
  /** Detailed overview */
  overview?: string;
  /** URL to poster image */
  posterUrl?: string;
  /** URL to backdrop/banner image */
  backdropUrl?: string;
  /** Release year (first aired) */
  releaseYear?: number;
  /** Average rating (e.g., from TMDB or user votes) */
  rating?: number;
  /** List of genre names or IDs */
  genres?: string[];
  /** Total number of seasons */
  totalSeasons?: number;
  /** Total number of episodes across all seasons */
  totalEpisodes?: number;
  /** Slug for SEO-friendly URLs */
  slug?: string;
  /** Whether the series is currently ongoing */
  isOngoing?: boolean;
  /** Original language */
  originalLanguage?: string;
  /** Production countries */
  productionCountries?: string[];
  /** Date when the record was created */
  createdAt?: Date;
  /** Date when the record was last updated */
  updatedAt?: Date;
}

export interface Season {
  /** Unique identifier */
  id: string;
  /** Reference to the parent series */
  seriesId: string;
  /** Season number (1-based) */
  seasonNumber: number;
  /** Title of the season (if any) */
  title?: string;
  /** Brief description */
  description?: string;
  /** Overview / plot summary */
  overview?: string;
  /** Poster image URL */
  posterUrl?: string;
  /** Release date of the season */
  releaseDate?: Date;
  /** Number of episodes in this season */
  episodeCount?: number;
  /** Average rating for the season */
  rating?: number;
  /** Created timestamp */
  createdAt?: Date;
  /** Updated timestamp */
  updatedAt?: Date;
}

export interface Episode {
  /** Unique identifier */
  id: string;
  /** Reference to the parent series */
  seriesId: string;
  /** Season number this episode belongs to */
  seasonNumber: number;
  /** Episode number within the season */
  episodeNumber: number;
  /** Title of the episode */
  title: string;
  /** Short description */
  description?: string;
  /** Detailed overview */
  overview?: string;
  /** URL to video file or streaming source */
  videoUrl?: string;
  /** Thumbnail image URL */
  thumbnailUrl?: string;
  /** Duration in minutes */
  duration?: number;
  /** Release date */
  releaseDate?: Date;
  /** Rating (e.g., user votes) */
  rating?: number;
  /** Created timestamp */
  createdAt?: Date;
  /** Updated timestamp */
  updatedAt?: Date;
}