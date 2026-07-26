import { z } from 'zod';

// Common string validators
const nonEmptyString = z.string().min(1, 'Field is required');
const urlString = z.string().url('Must be a valid URL').optional();
const yearString = z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number').refine(val => {
  const year = parseInt(val, 10);
  return year >= 1900 && year <= new Date().getFullYear() + 1;
}, 'Year must be between 1900 and next year');

// Series schemas
export const createSeriesSchema = z.object({
  title: nonEmptyString.max(200, 'Title too long'),
  description: nonEmptyString.max(2000, 'Description too long'),
  genre: nonEmptyString.max(100, 'Genre too long'),
  releaseYear: yearString,
  posterUrl: urlString,
  trailerUrl: urlString,
  rating: z.number().min(0).max(10).optional(),
});

export const updateSeriesSchema = createSeriesSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

// Episode schemas
export const createEpisodeSchema = z.object({
  seriesId: z.string().uuid('Invalid series ID'),
  episodeNumber: z.number().int().positive('Episode number must be a positive integer'),
  title: nonEmptyString.max(200, 'Title too long'),
  description: nonEmptyString.max(2000, 'Description too long'),
  videoUrl: z.string().url('Must be a valid URL'),
  duration: z.number().int().positive('Duration must be a positive integer (minutes)'),
  releaseDate: z.string().datetime({ offset: true }).optional(),
});

export const updateEpisodeSchema = createEpisodeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

// Exported types (optional)
export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;
export type UpdateSeriesInput = z.infer<typeof updateSeriesSchema>;
export type CreateEpisodeInput = z.infer<typeof createEpisodeSchema>;
export type UpdateEpisodeInput = z.infer<typeof updateEpisodeSchema>;