import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Match extends Document {
  categoryName: string;
  players: Array<Player>;
  defender: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
