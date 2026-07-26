import { Router, Request, Response, NextFunction } from 'express';
import { episodeController } from '../controllers/episode.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import { episodeSchema } from '../validation/episode.validation';

const router = Router();

// Public routes (no auth required)
router.get('/', episodeController.getAllEpisodes);
router.get('/:id', episodeController.getEpisodeById);

// Protected routes (authentication required)
router.use(authenticate);

// Admin-only routes
router.post(
  '/',
  authorize(['admin']),
  validate(episodeSchema),
  episodeController.createEpisode
);

router.put(
  '/:id',
  authorize(['admin']),
  validate(episodeSchema),
  episodeController.updateEpisode
);

router.delete(
  '/:id',
  authorize(['admin']),
  episodeController.deleteEpisode
);

export default router;