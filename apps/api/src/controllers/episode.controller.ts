import { Request, Response, NextFunction } from 'express';
import { EpisodeService } from '../services/episode.service';
import { ValidationError } from '../utils/errors';

/**
 * کنترلر اپیزود
 * مدیریت درخواست‌های HTTP مربوط به اپیزودها و بازگرداندن پاسخ‌های قالب‌بندی شده.
 */
export class EpisodeController {
  private episodeService: EpisodeService;

  constructor() {
    this.episodeService = new EpisodeService();
  }

  /**
   * دریافت لیست تمام اپیزودها (با صفحه‌بندی و فیلترهای اختیاری)
   * GET /episodes
   */
  public getEpisodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, search, genre } = req.query;
      const filters: any = {};
      if (search) filters.search = String(search);
      if (genre) filters.genre = String(genre);

      const episodes = await this.episodeService.findAll({
        page: Number(page),
        limit: Number(limit),
        filters,
      });

      res.status(200).json({
        success: true,
        data: episodes,
        message: 'لیست اپیزودها با موفقیت دریافت شد',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * دریافت یک اپیزود بر اساس شناسه
   * GET /episodes/:id
   */
  public getEpisodeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('شناسه اپیزود الزامی است');
      }

      const episode = await this.episodeService.findById(String(id));
      if (!episode) {
        res.status(404).json({
          success: false,
          message: 'اپیزود مورد نظر یافت نشد',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: episode,
        message: 'اپیزود با موفقیت دریافت شد',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * ایجاد اپیزود جدید
   * POST /episodes
   */
  public createEpisode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const episodeData = req.body;
      // اعتبارسنجی ساده؛ می‌توان از Joi یا class-validator استفاده کرد
      if (!episodeData.title || !episodeData.seasonNumber || !episodeData.episodeNumber) {
        throw new ValidationError('عنوان، شماره فصل و شماره قسمت الزامی هستند');
      }

      const newEpisode = await this.episodeService.create(episodeData);
      res.status(201).json({
        success: true,
        data: newEpisode,
        message: 'اپیزود با موفقیت ایجاد شد',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * به‌روزرسانی اپیزود موجود
   * PUT /episodes/:id
   */
  public updateEpisode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('شناسه اپیزود الزامی است');
      }

      const updateData = req.body;
      const updatedEpisode = await this.episodeService.update(String(id), updateData);
      if (!updatedEpisode) {
        res.status(404).json({
          success: false,
          message: 'اپیزود مورد نظر برای به‌روزرسانی یافت نشد',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedEpisode,
        message: 'اپیزود با موفقیت به‌روزرسانی شد',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * حذف اپیزود
   * DELETE /episodes/:id
   */
  public deleteEpisode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError('شناسه اپیزود الزامی است');
      }

      const deleted = await this.episodeService.remove(String(id));
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'اپیزود مورد نظر برای حذف یافت نشد',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: null,
        message: 'اپیزود با موفقیت حذف شد',
      });
    } catch (error) {
      next(error);
    }
  };
}

// ایجاد یک singleton instance برای استفاده در روت‌ها
export const episodeController = new EpisodeController();