import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/categories.create.dto';
import { UpdateCategoryDto } from './dtos/categories.update.dto';
import { Category } from './interfaces/categories.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createDto);
  }

  @Get()
  async getAll(): Promise<Array<Category>> {
    return await this.categoriesService.getAll();
  }

  @Get('/:name')
  async getByName(@Param('name') name: string): Promise<Category> {
    return await this.categoriesService.getByName(name);
  }

  @Put('/:name')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateDto: UpdateCategoryDto,
    @Param('name') name: string,
  ): Promise<void> {
    return await this.categoriesService.update(name, updateDto);
  }

  @Post('/:name/players/:playerId')
  async assignPlayer(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.assignPlayer(params);
  }
}
