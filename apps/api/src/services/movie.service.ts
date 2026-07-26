import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { PaginatedResultDto } from '../dto/paginated-result.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: Partial<Movie> = {},
  ): Promise<PaginatedResultDto<Movie>> {
    const query = this.movieRepository.createQueryBuilder('movie');

    if (filters.title) {
      query.andWhere('movie.title ILike :title', { title: `%${filters.title}%` });
    }
    if (filters.genre) {
      query.andWhere('movie.genre = :genre', { genre: filters.genre });
    }
    if (filters.minRating !== undefined) {
      query.andWhere('movie.rating >= :minRating', { minRating: filters.minRating });
    }
    if (filters.maxRating !== undefined) {
      query.andWhere('movie.rating <= :maxRating', { maxRating: filters.maxRating });
    }
    if (filters.releaseDateFrom) {
      query.andWhere('movie.releaseDate >= :releaseDateFrom', { releaseDateFrom: filters.releaseDateFrom });
    }
    if (filters.releaseDateTo) {
      query.andWhere('movie.releaseDate <= :releaseDateTo', { releaseDateTo: filters.releaseDateTo });
    }

    query.orderBy('movie.createdAt', 'DESC');

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

  async findOne(id: number):