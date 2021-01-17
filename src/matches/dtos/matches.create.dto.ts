import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/matches.interface';

export class CreateMatchDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsArray()
  @ArrayMinSize(2)
  players: Array<Player>;

  @IsNotEmpty()
  defender: Player;

  @IsArray()
  result: Array<Result>;
}
