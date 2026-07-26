import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GenreService } from '../services/genre.service';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, description: 'Return list of genres.' })
  async findAll() {
    const genres = await this.genreService.findAll();
    return {
      success: true,
      data: genres,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get genre by ID' })
  @ApiResponse({ status: 200, description: 'Return the genre.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const genre = await this.genreService.findOne(id);
    return {
      success: true,
      data: genre,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({ status: 201, description: 'The genre has been created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createGenreDto: CreateGenreDto) {
    const genre = await this.genreService.create(createGenreDto);
    return {
      success: true,
      data: genre,
      message: 'Genre created successfully',
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing genre' })
  @ApiResponse({ status: 200, description: 'The genre has been updated.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    const genre = await this.genreService.update(id, updateGenreDto);
    return {
      success: true,
      data: genre,
      message: 'Genre updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a genre' })
  @ApiResponse({ status: 200, description: 'The genre has been deleted.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.genreService.remove(id);
    return {
      success: true,
      message: 'Genre deleted successfully',
    };
  }
}