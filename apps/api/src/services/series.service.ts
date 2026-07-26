import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Series } from '../entities/series.entity';
import { Season } from '../entities/season.entity';
import { CreateSeriesDto } from '../dto/create-series.dto';
import { UpdateSeriesDto } from '../dto/update-series.dto';
import { PaginatedResultDto } from '../dto/paginated-result.dto';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
    @InjectRepository(Season)
    private seasonRepository: Repository<Season>,
  ) {}

  async create(createSeriesDto: CreateSeriesDto): Promise<Series> {
    const series = this.seriesRepository.create(createSeriesDto);
    return await this.seriesRepository.save(series);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: Partial<Series> = {},
  ): Promise<PaginatedResultDto<Series>> {
    const query = this.seriesRepository.createQueryBuilder('series')
      .leftJoinAndSelect('series.seasons', 'seasons');

    if (filters.title) {
      query.andWhere('series.title LIKE :title', { title: `%${filters.title}%` });
    }
    if (filters.genre) {
      query.andWhere('series.genre = :genre', { genre: filters.genre });
    }
    if (filters.minRating !== undefined) {
      query.andWhere('series.rating >= :minRating', { minRating: filters.minRating });
    }
    if (filters.maxRating !== undefined) {
      query.andWhere('series.rating <= :maxRating', { maxRating: filters.maxRating });
    }
    if (filters.releaseDateFrom) {
      query.andWhere('series.releaseDate >= :releaseDateFrom', { releaseDateFrom: filters.releaseDateFrom });
    }
    if (filters.releaseDateTo) {
      query.andWhere('series.releaseDate <= :releaseDateTo', { releaseDateTo: filters.releaseDateTo });
    }

    const [items, total] = await query
      .orderBy('series.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Series> {
    const series = await this.seriesRepository.findOne({
      where: { id },
      relations: ['seasons'],
    });
    if (!series) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }
    return series;
  }

  async update(id: number, updateSeriesDto: UpdateSeriesDto): Promise<Series> {
    await this.seriesRepository.update(id, updateSeriesDto);
    const updated = await this.findOne(id);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.seriesRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }
  }
}