import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async createOrUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    this.create(createPlayerDto);
  }

  private create(createPlayerDto: CreatePlayerDto): void {
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

    this.logger.log(`PlayerDTO: ${JSON.stringify(player)}`);
    this.players.push(player);
  }
}
