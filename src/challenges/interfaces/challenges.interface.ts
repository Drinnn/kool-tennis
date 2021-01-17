import { Document } from 'mongoose';
import { Match } from 'src/matches/interfaces/matches.interface';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from '../challenge-status.enum';

export interface Challenge extends Document {
  dateTime: Date;
  status: ChallengeStatus;
  requestDateTime: Date;
  responseDateTime: Date;
  requester: Player;
  categoryName: string;
  players: Array<Player>;
  match: Match;
}
