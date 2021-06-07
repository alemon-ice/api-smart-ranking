import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async createOrUpdatePlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    const { email } = createPlayerDto;

    const playerExist = this.players.find((player) => player.email === email);

    if (playerExist) {
      return await this.update(playerExist, createPlayerDto);
    } else {
      return await this.create(createPlayerDto);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const player = this.players.find((player) => player.email === email);

    if (!player) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado!`,
      );
    }

    return player;
  }

  async deletePlayer(email: string): Promise<Player> {
    const player = await this.getPlayerByEmail(email);

    this.players = this.players.filter(
      (playerItem) => playerItem.email !== player.email,
    );

    return player;
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { name, email, phoneNumber } = createPlayerDto;

    const player: Player = {
      _id: uuidv4(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      rankingPosition: 1,
      imageUrl: 'https://avatars.githubusercontent.com/u/43359988?v=4',
    };

    this.players.push(player);

    return player;
  }

  private async update(
    playerExist: Player,
    updatePlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    playerExist.name = updatePlayerDto.name;

    return playerExist;
  }
}
