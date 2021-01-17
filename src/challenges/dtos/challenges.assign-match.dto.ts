import { IsNotEmpty } from 'class-validator';
import { Result } from 'src/matches/interfaces/matches.interface';

export class AssignMatchChallengedDto {
  @IsNotEmpty()
  defender: string;

  @IsNotEmpty()
  result: Array<Result>;
}
