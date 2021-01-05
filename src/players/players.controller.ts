import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdate(@Body() playerCreateDto: PlayerCreateDto) {
    await this.playersService.createUpdate(playerCreateDto);
  }

  @Get()
  async get(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) return this.playersService.getByEmail(email);
    else return this.playersService.getAll();
  }

  @Delete()
  async delete(@Query('email') email: string): Promise<void> {
    return this.playersService.delete(email);
  }
}
