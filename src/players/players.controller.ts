import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.tdo';
import { PlayersService } from './players.service';
import { ParamsValidationPipe } from '../common/pipes/params-validation.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<string> {
    const playerResponse = await this.playersService.createPlayer(
      createPlayerDto,
    );

    return JSON.stringify({
      message: 'Jogador criado com sucesso',
      data: playerResponse,
    });
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('_id', ParamsValidationPipe) _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<string> {
    const playerResponse = await this.playersService.updatePlayer(
      _id,
      updatePlayerDto,
    );

    return JSON.stringify({
      message: 'Jogador atualizado com sucesso',
      data: playerResponse,
    });
  }

  @Get()
  async getPlayers(): Promise<string> {
    const players = await this.playersService.getAllPlayers();

    return JSON.stringify({
      message: 'Jogadores listados com sucesso',
      data: players,
    });
  }

  @Get('/:_id')
  async getPlayer(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<string> {
    const player = await this.playersService.findPlayerById(_id);

    return JSON.stringify({
      message: 'Jogador encontrado com sucesso',
      data: player,
    });
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<string> {
    await this.playersService.deletePlayer(_id);

    return JSON.stringify({
      message: 'Jogador deletado com sucesso',
    });
  }
}
