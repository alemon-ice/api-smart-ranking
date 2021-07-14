import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.tdo';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const emailAlreadyUsed = await this.playerModel.findOne({ email }).exec();

    if (emailAlreadyUsed) {
      throw new BadRequestException(`Email informado já cadastrado`);
    }

    const player = new this.playerModel(createPlayerDto);

    return await player.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const playerExist = await this.playerModel.findOne({ _id }).exec();

    if (!playerExist) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();

    if (!player) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    return player;
  }

  async deletePlayer(_id: string): Promise<Player> {
    const playerExist = await this.playerModel.findOne({ _id }).exec();

    if (!playerExist) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    return await this.playerModel.remove({ _id }).exec();
  }
}
