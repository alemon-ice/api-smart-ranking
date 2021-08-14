import { IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import {
  ChallengeStatusValues,
  ChallengeStatusEnumValues,
} from '../interfaces/challenge.interface';

export class UpdateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  datetimeChallenge: Date;

  @IsEnum(ChallengeStatusValues)
  @IsNotEmpty()
  status: ChallengeStatusEnumValues;
}
