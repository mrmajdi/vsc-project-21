import { Router, Request, Response, NextFunction } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import {
  getSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
  getSeriesEpisodes,
  createEpisode,
  updateEpisode,
  deleteEpisode,
} from '../controllers/series.controller';

const router = Router();

/**
 * @route   GET /api/series
 * @desc    Get all series (with optional filters, pagination)
 * @access  Public
 */
router.get('/', asyncHandler(getSeries));

/**
 * @route   GET /api/series/:id
 * @desc    Get series by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(getSeriesById));

/**
 * @route   POST /api/series
 * @desc    Create a new series
 * @access  Private/Admin
 */
router.post('/', protect, authorize('admin'), asyncHandler(createSeries));

/**
 * @route   PUT /api/series/:id
 * @desc    Update series by ID
 * @access  Private/Admin
 */
router.put('/:id', protect, authorize('admin'), asyncHandler(updateSeries));

/**
 * @route   DELETE /api/series/:id
 * @desc    Delete series by ID
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteSeries));

/**
 * @route   GET /api/series/:seriesId/episodes
 * @desc    Get episodes for a specific series
 * @access  Public
 */
router.get(
  '/:seriesId/episodes',
  asyncHandler(getSeriesEpisodes)
);

/**
 * @route   POST /api/series/:seriesId/episodes
 * @desc    Create a new episode for a series
 * @access  Private/Admin
 */
router.post(
  '/:seriesId/episodes',
  protect,
  authorize('admin'),
  asyncHandler(createEpisode)
);

/**
 * @route   PUT /api/series/:seriesId/episodes/:episodeId
 * @desc    Update episode by ID
 * @access  Private/Admin
 */
router.put(
  '/:seriesId/episodes/:episodeId',
  protect,
  authorize('admin'),
  asyncHandler(updateEpisode)
);

/**
 * @route   DELETE /api/series/:seriesId/episodes/:episodeId
 * @desc    Delete episode by ID
 * @access  Private/Admin
 */
router.delete(
  '/:seriesId/episodes/:episodeId',
  protect,
  authorize('admin'),
  asyncHandler(deleteEpisode)
);

export default router;