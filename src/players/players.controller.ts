import { Body, Controller, Post } from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';

@Controller('players')
export class PlayersController {
  @Post()
  async createUpdate(@Body() playerCreateDto: PlayerCreateDto) {
    const { email } = playerCreateDto;
    return JSON.stringify({
      email: email,
    });
  }
}
