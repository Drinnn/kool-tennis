import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMatchDto } from './dtos/matches.create.dto';
import { Match } from './interfaces/matches.interface';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
  ) {}

  async create(createDto: CreateMatchDto): Promise<Match> {
    const createdMatch = new this.matchModel(createDto);

    return await createdMatch.save();
  }
}
