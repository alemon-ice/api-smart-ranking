import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createOrUpdatePlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    const { email } = createPlayerDto;

    const playerExist = await this.playerModel.findOne({ email }).exec();
    this.logger.log(playerExist);

    return playerExist
      ? await this.update(createPlayerDto)
      : await this.create(createPlayerDto);
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();

    if (!player) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado!`,
      );
    }

    return player;
  }

  async deletePlayer(email: string): Promise<Player> {
    return await this.playerModel.remove({ email }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = new this.playerModel(createPlayerDto);
    this.logger.log(player);

    return await player.save();
  }

  private async update(updatePlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: updatePlayerDto.email },
        { $set: updatePlayerDto },
      )
      .exec();
  }
}
