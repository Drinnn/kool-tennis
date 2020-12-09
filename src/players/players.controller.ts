import { Body, Controller, Post } from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdate(@Body() playerCreateDto: PlayerCreateDto) {
    await this.playersService.createUpdate(playerCreateDto);
  }
}
