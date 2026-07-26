import { Router, Request, Response, NextFunction } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { validateMovie } from '../middleware/validation.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movie.controller';

const router = Router();

// Public routes
router.get('/', asyncHandler(getMovies));
router.get('/:id', asyncHandler(getMovieById));

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', validateMovie, asyncHandler(createMovie));
router.put('/:id', validateMovie, asyncHandler(updateMovie));
router.delete('/:id', asyncHandler(deleteMovie));

export default router;