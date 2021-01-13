import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/categories.create.dto';
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
}
