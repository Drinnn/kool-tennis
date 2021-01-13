import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/categories.create.dto';
import { Category } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const { name } = createDto;

    const existentCategory = await this.categoryModel.findOne({ name }).exec();

    if (existentCategory) {
      throw new BadRequestException(`Category ${name} already exists.`);
    }

    const createdCategory = new this.categoryModel(createDto);
    return await createdCategory.save();
  }

  async getAll(): Promise<Array<Category>> {
    return await this.categoryModel.find().exec();
  }

  async getByName(name: string): Promise<Category> {
    const foundedCategory = await this.categoryModel.findOne({ name }).exec();

    if (!foundedCategory) {
      throw new NotFoundException(`Category ${name} doesn't exists.`);
    }

    return foundedCategory;
  }
}
