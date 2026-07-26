import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Movie, MovieFormValues } from '@/types/movie';
import { movieService } from '@/services/movieService';

/**
 * Hook to fetch a list of movies with optional filters.
 */
export function useMovies(filters?: Partial<Movie>) {
  return useQuery({
    queryKey: ['movies', filters],
    queryFn: () => movieService.getMovies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single movie by ID.
 */
export function useMovie(id: string) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieService.getMovieById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to create a new movie.
 */
export function useCreateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MovieFormValues) => movieService.createMovie(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
}

/**
 * Hook to update an existing movie.
 */
export function useUpdateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MovieFormValues> }) =>
      movieService.updateMovie(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie', variables.id] });
    },
  });
}

/**
 * Hook to delete a movie.
 */
export function useDeleteMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => movieService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
}