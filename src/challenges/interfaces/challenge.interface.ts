import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export const ChallengeStatusValues: {
  [key: string]: ChallengeStatusEnumValues;
} = {
  DONE: 'DONE',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DENIED: 'DENIED',
  CANCELED: 'CANCELED',
};

enum ChallengeStatusEnum {
  DONE,
  PENDING,
  ACCEPTED,
  DENIED,
  CANCELED,
}

export type ChallengeStatusEnumValues = keyof typeof ChallengeStatusEnum;

export interface Challenge extends Document {
  datetimeChallenge: Date;
  status: ChallengeStatusEnumValues;
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
