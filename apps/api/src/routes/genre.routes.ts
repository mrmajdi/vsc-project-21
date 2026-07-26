import { Router, Request, Response, NextFunction } from 'express';
import { getAllGenres, getGenreById } from '../controllers/genre.controller';

const router = Router();

/**
 * @route GET /api/genres
 * @desc Get all genres
 * @access Public
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genres = await getAllGenres();
    res.json(genres);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/genres/:id
 * @desc Get genre by ID
 * @access Public
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const genreId = Number(id);
    if (isNaN(genreId)) {
      res.status(400).json({ message: 'Invalid genre ID' });
      return;
    }
    const genre = await getGenreById(genreId);
    if (!genre) {
      res.status(404).json({ message: 'Genre not found' });
    } else {
      res.json(genre);
    }
  } catch (error) {
    next(error);
  }
});

export default router;