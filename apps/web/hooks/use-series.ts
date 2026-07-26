import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Series, SeriesFormValues, Episode, EpisodeFormValues } from '@/types/series';
import { seriesService } from '@/services/seriesService';

/**
 * هوک برای دریافت لیست سریال‌ها با فیلترهای اختیاری
 * @param filters - فیلترهای اختیاری (مثلاً ژانر، سال انتشار و ...)
 */
export function useSeries(filters?: Partial<Series>) {
  return useQuery({
    queryKey: ['series', filters],
    queryFn: () => seriesService.getSeries(filters),
    staleTime: 5 * 60 * 1000, // 5 دقیقه
  });
}

/**
 * هوک برای دریافت یک سریال خاص بر اساس شناسه
 * @param id - شناسه سریال
 */
export function useSeriesById(id: string) {
  return useQuery({
    queryKey: ['series', id],
    queryFn: () => seriesService.getSeriesById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 دقیقه
  });
}

/**
 * هوک برای دریافت لیست اپیزودهای یک سریال
 * @param seriesId - شناسه سریال
 */
export function useEpisodes(seriesId: string) {
  return useQuery({
    queryKey: ['episodes', seriesId],
    queryFn: () => seriesService.getEpisodes(seriesId),
    enabled: !!seriesId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * هوک برای دریافت یک اپیزود خاص بر اساس شناسه
 * @param episodeId - شناسه اپیزود
 */
export function useEpisodeById(episodeId: string) {
  return useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => seriesService.getEpisodeById(episodeId),
    enabled: !!episodeId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * هوک برای ایجاد سریال جدید
 * پس از موفقیت، لیست سریال‌ها و کوئری‌های مرتبط را_INVALIDATE_ می‌کند
 */
export function useCreateSeries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SeriesFormValues) => seriesService.createSeries(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    },
  });
}

/**
 * هوک برای به‌روزرسانی یک سریال موجود
 * پس از موفقیت، کوئری‌های لیست سریال و سریال خاص را_INVALIDATE_ می‌کند
 */
export function useUpdateSeries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SeriesFormValues }) =>
      seriesService.updateSeries(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['series', variables.id] });
    },
  });
}

/**
 * هوک برای حذف یک سریال
 * پس از موفقیت، لیست سریال‌ها را_INVALIDATE_ می‌کند
 */
export function useDeleteSeries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => seriesService.deleteSeries(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    },
  });
}

/**
 * هوک برای ایجاد اپیزود جدید در یک سریال
 * پس از موفقیت، لیست اپیزودهای آن سریال را_INVALIDATE_ می‌کند
 */
export function useCreateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ seriesId, data }: { seriesId: string; data: EpisodeFormValues }) =>
      seriesService.createEpisode(seriesId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['episodes', variables.seriesId] });
    },
  });
}

/**
 * هوک برای به‌روزرسانی یک اپیزود
 * پس از موفقیت، کوئری‌های لیست اپیزودها و اپیزود خاص را_INVALIDATE_ می‌کند
 */
export function useUpdateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      episodeId,
      data,
    }: {
      episodeId: string;
      data: EpisodeFormValues;
    }) => seriesService.updateEpisode(episodeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
      queryClient.invalidateQueries({ queryKey: ['episode', variables.episodeId] });
    },
  });
}

/**
 * هوک برای حذف یک اپیزود
 * پس از موفقیت، لیست اپیزودهای سریال مربوطه را_INVALIDATE_ می‌کند
 */
export function useDeleteEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (episodeId: string) => seriesService.deleteEpisode(episodeId),
    onSuccess: (_, variables) => {
      // برای_INVALIDATE_ لیست اپیزودها نیاز به seriesId داریم؛
      // در اینجا فرض می‌کنیم که سرویس حذف پس از موفقیت seriesId را برمی‌گرداند
      // یا می‌توانیم به صورت کلی لیست اپیزودها را_INVALIDATE_ کنیم.
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}