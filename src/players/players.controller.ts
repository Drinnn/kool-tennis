import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdate(@Body() playerCreateDto: PlayerCreateDto) {
    await this.playersService.createUpdate(playerCreateDto);
  }

  @Get()
  async getAll(): Promise<Player[]> {
    return this.playersService.getAll();
  }
}
