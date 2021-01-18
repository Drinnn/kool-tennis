import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParametersValidationPipe } from 'src/common/pipes/parameters-validation.pipe';
import { ChallengesService } from './challenges.service';
import { AssignMatchChallengedDto } from './dtos/challenges.assign-match.dto';
import { CreateChallengeDto } from './dtos/challenges.create.dto';
import { UpdateChallengeDto } from './dtos/challenges.update.dto';
import { Challenge } from './interfaces/challenges.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenges.status-validation.pipe';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createDto: CreateChallengeDto): Promise<Challenge> {
    return await this.challengesService.create(createDto);
  }

  @Get()
  async get(@Query('playerId') playerId): Promise<Challenge[]> {
    if (playerId) return await this.challengesService.getByPlayerId(playerId);

    return await this.challengesService.getAll();
  }

  @Put('/:_id')
  async update(
    @Body(ChallengeStatusValidationPipe) updateDto: UpdateChallengeDto,
    @Param('_id', ParametersValidationPipe) _id: string,
  ): Promise<void> {
    return await this.challengesService.update(_id, updateDto);
  }

  @Delete('/:_id')
  async delete(
    @Param('_id', ParametersValidationPipe) _id: string,
  ): Promise<void> {
    return await this.challengesService.delete(_id);
  }

  @Post('/:_id')
  async assignMatch(
    @Body() assignDto: AssignMatchChallengedDto,
    @Param('_id', ParametersValidationPipe) _id: string,
  ): Promise<Challenge> {
    return await this.challengesService.assignMatch(_id, assignDto);
  }
}
