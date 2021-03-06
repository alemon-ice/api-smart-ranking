import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
  Match,
} from './interfaces/challenge.interface';
import { isPast } from 'date-fns';
import { Player } from 'src/players/interfaces/player.interface';
import { Category } from 'src/categories/interface/category.interface';
import { sub } from 'date-fns';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssignChallengeToMatchDto } from './dtos/assign-challenge-to-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
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
      const playerExist = await this.playersService.findPlayerById(player);

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
      status: ChallengeStatusValues.PENDING,
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

  async findChallengeById(_id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findOne({ _id }).exec();

    if (!challenge) {
      throw new NotFoundException(`Desafio com id ${_id} não encontrado`);
    }

    return challenge;
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    await this.findChallengeById(_id);

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: updateChallengeDto })
      .exec();
  }

  async deleteChallenge(_id: string): Promise<void> {
    await this.findChallengeById(_id);

    await this.challengeModel.deleteOne({ _id }).exec();
  }

  async assignChallengeToMatch(
    _id: string,
    assignChallengeToMatchDto: AssignChallengeToMatchDto,
  ): Promise<void> {
    const challenge = await this.findChallengeById(_id);

    const defPlayer = challenge.players.find(
      (player) =>
        player.toString() === assignChallengeToMatchDto.def.toString(),
    );

    if (!defPlayer) {
      throw new BadRequestException(`Vencedor não faz parte do Desafio`);
    }

    const matchCreate = new this.matchModel(assignChallengeToMatchDto);

    matchCreate.category = challenge.category;
    matchCreate.players = challenge.players;

    const match = await matchCreate.save();

    challenge.status = ChallengeStatusValues.DONE;
    challenge.match = match._id;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (err) {
      await this.matchModel.deleteOne({ _id: match._id }).exec();

      throw new InternalServerErrorException();
    }
  }
}
