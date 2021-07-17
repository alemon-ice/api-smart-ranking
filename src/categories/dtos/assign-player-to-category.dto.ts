import { IsNotEmpty, IsString } from 'class-validator';

export class AssignPlayerToCategoryDto {
  @IsString()
  @IsNotEmpty()
  player: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}
