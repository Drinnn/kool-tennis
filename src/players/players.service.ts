import { Injectable, Logger } from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  private players: Player[] = [];

  async createUpdate(playerCreateDto: PlayerCreateDto): Promise<void> {
    this.create(playerCreateDto);
  }

  private create(playerCreateDto: PlayerCreateDto): void {
    const { phoneNumber, email, name } = playerCreateDto;

    const player: Player = {
      _id: uuid(),
      phoneNumber,
      email,
      name,
      ranking: 'A',
      rankingPosition: 1,
      avatarUrl: 'www.google.com/foto123.jpg',
    };

    this.logger.log(`new player: ${JSON.stringify(player)}`);
    this.players.push(player);
  }
}
