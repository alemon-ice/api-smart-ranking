import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AssignChallengeToMatchDto } from './dtos/assign-challenge-to-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<string> {
    const challenge = await this.challengesService.createChallenge(
      createChallengeDto,
    );

    return JSON.stringify({
      message: 'Desafio criado com sucesso',
      data: challenge,
    });
  }

  @Get()
  async getChallenges(@Query('player') player?: string): Promise<string> {
    const challenges = await this.challengesService.getChallenges(player);

    return JSON.stringify({
      message: 'Desafios listados com sucesso',
      data: challenges,
    });
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateChallenge(
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Param('_id') _id: string,
  ): Promise<string> {
    await this.challengesService.updateChallenge(_id, updateChallengeDto);

    return JSON.stringify({
      message: 'Desafio atualizado com sucesso',
    });
  }

  @Delete('/:_id')
  @UsePipes(ValidationPipe)
  async deleteChallenge(@Param('_id') _id: string): Promise<string> {
    await this.challengesService.deleteChallenge(_id);

    return JSON.stringify({
      message: 'Desafio deletado com sucesso',
    });
  }

  @Post('/:_id/assign-match')
  @UsePipes(ValidationPipe)
  async assignChallengeToMatch(
    @Body() assignChallengeToMatchDto: AssignChallengeToMatchDto,
    @Param('_id') _id: string,
  ): Promise<string> {
    await this.challengesService.assignChallengeToMatch(
      _id,
      assignChallengeToMatchDto,
    );

    return JSON.stringify({
      message: 'Desafio atribuído à partida com sucesso!',
    });
  }
}
