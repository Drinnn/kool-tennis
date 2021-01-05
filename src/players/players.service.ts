import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createUpdate(playerCreateDto: PlayerCreateDto): Promise<void> {
    const { email } = playerCreateDto;

    const existentPlayer = await this.playerModel.findOne({ email }).exec();

    if (existentPlayer) this.update(existentPlayer);
    else this.create(playerCreateDto);
  }

  async getAll(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();

    if (!player)
      throw new NotFoundException(`Player with e-mail ${email} not found.`);

    return player;
  }

  async delete(email: string): Promise<any> {
    await this.playerModel.deleteOne({ email }).exec();
  }

  private async create(playerCreateDto: PlayerCreateDto): Promise<Player> {
    const createdPlayer = new this.playerModel(playerCreateDto);

    return await createdPlayer.save();
  }

  private async update(playerCreateDto: PlayerCreateDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: playerCreateDto.email },
        { $set: playerCreateDto },
      )
      .exec();
  }
}
