import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export const ChallengeStatusValues = {
  DONE: 'DONE',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DENIED: 'DENIED',
  CANCELED: 'CANCELED',
};

export enum ChallengeStatusEnum {
  DONE,
  PENDING,
  ACCEPTED,
  DENIED,
  CANCELED,
}

export interface Challenge extends Document {
  datetimeChallenge: Date;
  status: ChallengeStatusEnum;
  datetimeRequest: Date;
  datetimeResponse: Date;
  challenger: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
