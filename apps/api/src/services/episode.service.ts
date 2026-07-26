import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Episode } from '../entities/episode.entity';
import { CreateEpisodeDto } from '../dto/create-episode.dto';
import { UpdateEpisodeDto } from '../dto/update-episode.dto';
import { PaginatedResultDto } from '../dto/paginated-result.dto';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
  ) {}

  async create(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    const episode = this.episodeRepository.create(createEpisodeDto);
    return await this.episodeRepository.save(episode);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: Partial<Episode> = {},
  ): Promise<PaginatedResultDto<Episode>> {
    const query = this.episodeRepository.createQueryBuilder('episode');

    // Apply filters
    if (filters.title) {
      query.andWhere('episode.title LIKE :title', { title: `%${filters.title}%` });
    }
    if (filters.seasonId) {
      query.andWhere('episode.seasonId = :seasonId', { seasonId: filters.seasonId });
    }
    if (filters.videoUrl) {
      query.andWhere('episode.videoUrl LIKE :videoUrl', { videoUrl: `%${filters.videoUrl}%` });
    }
    if (filters.duration !== undefined) {
      query.andWhere('episode.duration = :duration', { duration: filters.duration });
    }
    if (filters.releaseDateFrom) {
      query.andWhere('episode.releaseDate >= :releaseDateFrom', { releaseDateFrom: filters.releaseDateFrom });
    }
    if (filters.releaseDateTo) {
      query.andWhere('episode.releaseDate <= :releaseDateTo', { releaseDateTo: filters.releaseDateTo });
    }

    // Order by createdAt descending
    query.orderBy('episode.createdAt', 'DESC');

    const [items, total] = await query
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

  async findOne(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.findOne({
      where: { id },
      relations: ['season'], // assuming relation to Season
    });
    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }
    return episode;
  }

  async update(id: number, updateEpisodeDto: UpdateEpisodeDto): Promise<Episode> {
    await this.episodeRepository.update(id, updateEpisodeDto);
    const updated = await this.findOne(id);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.episodeRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }
  }
}