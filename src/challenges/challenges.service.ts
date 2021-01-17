import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { MatchesService } from 'src/matches/matches.service';
import { PlayersService } from 'src/players/players.service';
import { ChallengeStatus } from './challenge-status.enum';
import { AssignMatchChallengedDto } from './dtos/challenges.assign-match.dto';
import { CreateChallengeDto } from './dtos/challenges.create.dto';
import { UpdateChallengeDto } from './dtos/challenges.update.dto';
import { Challenge } from './interfaces/challenges.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
    private readonly matchesService: MatchesService,
  ) {}

  async create(createDto: CreateChallengeDto): Promise<Challenge> {
    const { players, requester } = createDto;
    const allPlayers = await this.playersService.getAll();
    let requesterInPlayers;

    players.map((player) => {
      const playerExists = allPlayers.filter(
        (existentPlayer) => existentPlayer._id == player._id,
      );

      if (playerExists.length === 0) {
        throw new BadRequestException(
          `Player with ID ${player._id} doesn't exists.`,
        );
      }

      if (player._id == requester) requesterInPlayers = true;
    });

    if (!requesterInPlayers) {
      throw new BadRequestException(
        `The challenge must be created by one of the participant players.`,
      );
    }

    const requesterCategory = await this.categoriesService.getByPlayerId(
      requester,
    );

    if (!requesterCategory) {
      throw new BadRequestException(`Requester player must have a Category.`);
    }

    const createdChallenge = new this.challengeModel(createDto);
    createdChallenge.categoryName = requesterCategory.name;
    createdChallenge.requestDateTime = new Date();
    createdChallenge.status = ChallengeStatus.PENDING;

    return await createdChallenge.save();
  }

  async getAll(): Promise<Challenge[]> {
    return await this.challengeModel.find().exec();
  }

  async getByPlayerId(playerId: any): Promise<Challenge[]> {
    const existentPlayer = await this.playersService.getById(playerId);

    if (!existentPlayer) {
      throw new BadRequestException(
        `Player with ID ${playerId} doesn't exists.`,
      );
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(playerId)
      .exec();
  }

  async update(_id: string, updateDto: UpdateChallengeDto): Promise<void> {
    const existentChallenge = await this.challengeModel.findOne({ _id }).exec();

    if (!existentChallenge)
      throw new NotFoundException(`Challenge with ID ${_id} doesn't exists.`);

    const availableStatus = [
      ChallengeStatus.ACCEPTED,
      ChallengeStatus.DENIED,
      ChallengeStatus.CANCELED,
    ];

    if (!availableStatus.includes(updateDto.status))
      throw new BadRequestException(
        `Invalid status. Available status for update: ACCEPTED, DENIED, CANCELED`,
      );

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: updateDto })
      .exec();
  }

  async delete(_id: string): Promise<void> {
    const existentChallenge = await this.challengeModel.findOne({ _id }).exec();

    if (!existentChallenge)
      throw new NotFoundException(`Challenge with ID ${_id} doesn't exists.`);

    existentChallenge.status = ChallengeStatus.CANCELED;

    await existentChallenge.save();
  }

  async assignMatch(
    _id: string,
    assignDto: AssignMatchChallengedDto,
  ): Promise<void> {
    const { defender } = assignDto;
    const existentChallenge = await this.challengeModel
      .findOne({ _id })
      .populate('players')
      .exec();

    if (!existentChallenge)
      throw new NotFoundException(`Challenge with ID ${_id} doesn't exists.`);

    const defenderExistsInChallenge = existentChallenge.players.filter(
      (player) => {
        return player._id == defender;
      },
    );

    if (defenderExistsInChallenge.length === 0) {
      throw new BadRequestException(
        `Defender with ID ${defender} is not in challenge`,
      );
    }

    const createdMatch = await this.matchesService.create({
      categoryName: existentChallenge.categoryName,
      players: existentChallenge.players,
      defender: await this.playersService.getById(defender),
      result: assignDto.result,
    });

    existentChallenge.match = createdMatch;

    await existentChallenge.save();
  }
}
