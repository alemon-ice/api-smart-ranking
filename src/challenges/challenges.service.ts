import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import {
  Challenge,
  ChallengeStatusValues,
} from './interfaces/challenge.interface';
import { isPast } from 'date-fns';
import { Player } from 'src/players/interfaces/player.interface';
import { Category } from 'src/categories/interface/category.interface';
import { sub } from 'date-fns';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const { datetimeChallenge, challenger, players } = createChallengeDto;

    if (!players.includes(challenger)) {
      throw new BadRequestException(
        `O desafiante deve ser um dos jogadores da partida`,
      );
    } else if (isPast(new Date(datetimeChallenge))) {
      throw new BadRequestException(
        `A data informada para o desafio já passou`,
      );
    }

    const getPlayerWithCategory = async (player: string) => {
      const playerExist = await this.playersService.getPlayerById(player);

      if (!playerExist) {
        throw new NotFoundException(`Jogador informado não encontrado`);
      }

      const playerCategory = await this.categoriesService.getPlayerCategory(
        playerExist._id,
      );

      if (!playerCategory) {
        throw new NotFoundException(`Jogador não possui categoria`);
      }

      return {
        player: playerExist,
        playerCategory,
      };
    };

    const playersWithCategories: Array<{
      player: Player;
      playerCategory: Category;
    }> = [];
    playersWithCategories.push(await getPlayerWithCategory(players[0]));
    playersWithCategories.push(await getPlayerWithCategory(players[1]));

    const [
      { playerCategory: challengerCategory },
      { playerCategory: challengedCategory },
    ] = playersWithCategories;

    if (challengerCategory.category !== challengedCategory.category) {
      throw new BadRequestException(
        `Os jogadores devem ser da mesma categoria`,
      );
    }

    const challengeCreate = new this.challengeModel({
      ...createChallengeDto,
      category: challengerCategory.category,
      datetimeRequest: new Date(),
      status: ChallengeStatusValues.DONE,
    });

    return await challengeCreate.save();
  }

  async getChallenges(player?: string): Promise<Challenge[]> {
    let challenges: Challenge[] = [];

    if (player) {
      challenges = await this.challengeModel
        .find()
        .where('players')
        .in(player as any)
        .populate('players')
        .exec();
    } else {
      challenges = await this.challengeModel.find().populate('players').exec();
    }

    return challenges.map((challenge) => {
      const timezoneOffset = new Date().getTimezoneOffset() / 60;

      challenge.datetimeRequest = sub(challenge.datetimeRequest, {
        hours: timezoneOffset,
      });

      return challenge;
    });
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengeExist = await this.challengeModel.findOne({ _id }).exec();

    if (!challengeExist) {
      throw new NotFoundException(`Desafio com id ${_id} não foi encontrado`);
    }

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: updateChallengeDto })
      .exec();
  }

  async deleteChallenge(_id: string): Promise<void> {
    const challengeExist = await this.challengeModel.findOne({ _id }).exec();

    if (!challengeExist) {
      throw new NotFoundException(`Desafio com id ${_id} não foi encontrado`);
    }

    await this.challengeModel.deleteOne({ _id }).exec();
  }
}
