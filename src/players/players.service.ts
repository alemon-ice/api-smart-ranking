import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.tdo';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
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
    await this.findPlayerById(_id);

    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findPlayerById(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();

    if (!player) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    return player;
  }

  async deletePlayer(_id: string): Promise<void> {
    await this.findPlayerById(_id);

    await this.playerModel.deleteOne({ _id }).exec();
  }
}
