import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerCreateDto } from './dtos/player.create.dto';
import { PlayerUpdateDto } from './dtos/player.update.dto';
import { Player } from './interfaces/player.interface';
import { PlayerParametersValidationPipe } from './pipes/player-parameters-validation.pipe';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() playerCreateDto: PlayerCreateDto): Promise<Player> {
    return await this.playersService.create(playerCreateDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() playerUpdateDto: PlayerUpdateDto,
    @Param('_id', PlayerParametersValidationPipe) _id: string,
  ): Promise<void> {
    await this.playersService.update(_id, playerUpdateDto);
  }

  @Get()
  async getAll(): Promise<Player[]> {
    return this.playersService.getAll();
  }

  @Get('/:_id')
  async getById(
    @Param('_id', PlayerParametersValidationPipe) _id: string,
  ): Promise<Player> {
    return this.playersService.getById(_id);
  }

  @Delete('/:_id')
  async delete(
    @Param('_id', PlayerParametersValidationPipe) _id: string,
  ): Promise<void> {
    return this.playersService.delete(_id);
  }
}
