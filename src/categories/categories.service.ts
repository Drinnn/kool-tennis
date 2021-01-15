import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dtos/categories.create.dto';
import { UpdateCategoryDto } from './dtos/categories.update.dto';
import { Category } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
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
    return await this.categoryModel.find().populate('players').exec();
  }

  async getByName(name: string): Promise<Category> {
    const foundedCategory = await this.categoryModel.findOne({ name }).exec();

    if (!foundedCategory) {
      throw new NotFoundException(`Category ${name} doesn't exists.`);
    }

    return foundedCategory;
  }

  async update(name: string, updateDto: UpdateCategoryDto): Promise<void> {
    const foundedCategory = await this.categoryModel.findOne({ name }).exec();

    if (!foundedCategory) {
      throw new NotFoundException(`Category ${name} doesn't exists.`);
    }

    await this.categoryModel
      .findOneAndUpdate({ name }, { $set: updateDto })
      .exec();
  }

  async assignPlayer(params: string[]): Promise<void> {
    const categoryName = params['name'];
    const playerId = params['playerId'];

    const foundedCategory = await this.categoryModel
      .findOne({ name: categoryName })
      .exec();

    if (!foundedCategory) {
      throw new BadRequestException(`Category ${categoryName} doesn't exists.`);
    }

    const foundedPlayer = await this.playersService.getById(playerId);

    if (!foundedPlayer) {
      throw new BadRequestException(`Player with ID ${playerId} not found.`);
    }

    const playerAlreadyInCategory = await this.categoryModel
      .find({ name: categoryName })
      .where('players')
      .in(playerId)
      .exec();

    if (!!playerAlreadyInCategory) {
      throw new BadRequestException(
        `Player ${foundedPlayer.name} already on Category ${categoryName}.`,
      );
    }

    foundedCategory.players.push(playerId);

    await this.categoryModel
      .findOneAndUpdate({ name: categoryName }, { $set: foundedCategory })
      .exec();
  }
}
