import { IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { ChallengeStatusEnum } from '../interfaces/challenge.interface';

export class UpdateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  datetimeChallenge: Date;

  @IsEnum(ChallengeStatusEnum)
  @IsNotEmpty()
  status: ChallengeStatusEnum;
}
