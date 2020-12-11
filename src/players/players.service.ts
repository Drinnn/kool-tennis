import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  private players: Player[] = [];

  async createUpdate(playerCreateDto: PlayerCreateDto): Promise<void> {
    const { email } = playerCreateDto;

    const existentPlayer = this.players.find(
      (player) => player.email === email,
    );

    if (existentPlayer) this.update(existentPlayer, playerCreateDto);
    else this.create(playerCreateDto);
  }

  async getAll(): Promise<Player[]> {
    return this.players;
  }

  async getByEmail(email: string): Promise<Player> {
    const player = this.players.find((player) => player.email === email);
    if (!player)
      throw new NotFoundException(`Player with e-mail ${email} not found.`);

    return player;
  }

  async delete(email: string): Promise<void> {
    this.players = this.players.filter((player) => player.email !== email);
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

  private update(
    existentPlayer: Player,
    playerCreateDto: PlayerCreateDto,
  ): void {
    const { name } = playerCreateDto;

    existentPlayer.name = name;
  }
}
