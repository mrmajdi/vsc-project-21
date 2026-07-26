import { z } from 'zod';

/**
 * Schema for creating a new movie.
 */
export const createMovieSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است').max(200, 'عنوان حداکثر 200 کاراکتر می‌تواند باشد'),
  description: z.string().optional(),
  releaseYear: z
    .number()
    .int()
    .min(1900, 'سال انتشار باید بعد از 1900 باشد')
    .max(new Date().getFullYear() + 1, 'سال انتشار نمی‌تواند بیشتر از سال جاری + 1 باشد'),
  genre: z.array(z.string()).nonempty('حداقل یک ژانر باید انتخاب شود'),
  rating: z
    .number()
    .min(0, 'امتیاز نمی‌تواند کمتر از 0 باشد')
    .max(10, 'امتیاز نمی‌تواند بیشتر از 10 باشد')
    .optional(),
  posterUrl: z.string().url('پستر باید یک URL معتبر باشد').optional(),
  trailerUrl: z.string().url('تریلر باید یک URL معتبر باشد').optional(),
  durationMinutes: z
    .number()
    .int()
    .positive('مدت زمان باید عدد مثبت باشد')
    .optional(),
  isSeries: z.boolean().optional(),
});

/**
 * Schema for updating an existing movie.
 * All fields are optional except the movie ID.
 */
export const updateMovieSchema = z.object({
  id: z.string().uuid('شناسه فیلم باید یک UUID معتبر باشد'),
  ...createMovieSchema.shape,
}).partial(); // All fields from createMovieSchema become optional

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;