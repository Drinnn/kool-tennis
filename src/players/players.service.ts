import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerUpdateDto } from './dtos/player.update.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async create(playerCreateDto: PlayerCreateDto): Promise<Player> {
    const { email } = playerCreateDto;

    const existentPlayer = await this.playerModel.findOne({ email }).exec();

    if (existentPlayer)
      throw new BadRequestException(
        `Player with e-mail ${email} already exists.`,
      );

    const createdPlayer = new this.playerModel(playerCreateDto);

    return await createdPlayer.save();
  }

  async update(_id: string, playerUpdateDto: PlayerUpdateDto): Promise<void> {
    const existentPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!existentPlayer)
      throw new NotFoundException(`Player with ID ${_id} doesn't exists.`);

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: playerUpdateDto })
      .exec();
  }

  async getAll(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getById(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();

    if (!player)
      throw new NotFoundException(`Player with ID ${_id} not found.`);

    return player;
  }

  async delete(_id: string): Promise<any> {
    const player = await this.playerModel.findOne({ _id }).exec();

    if (!player)
      throw new NotFoundException(`Player with ID ${_id} not found.`);

    await this.playerModel.deleteOne({ _id }).exec();
  }
}
