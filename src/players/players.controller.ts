import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createOrUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const playerResponse = await this.playersService.createOrUpdatePlayer(
      createPlayerDto,
    );

    return JSON.stringify({
      message: 'Jogador salvo com sucesso',
      data: playerResponse,
    });
  }

  @Get()
  async getPlayers(@Query('email') email: string) {
    const response = {
      message: '',
      data: null,
    };

    if (email) {
      response.message = 'Jogador encontrado com sucesso';
      response.data = await this.playersService.getPlayerByEmail(email);
    } else {
      response.message = 'Jogadores listados com sucesso';
      response.data = await this.playersService.getAllPlayers();
    }

    return JSON.stringify(response);
  }
}
