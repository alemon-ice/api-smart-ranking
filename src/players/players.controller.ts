import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  @Post()
  async createOrUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const { name, email, phoneNumber } = createPlayerDto;

    return JSON.stringify({
      newUser: {
        nome: name,
        email: email,
        telefone: phoneNumber,
      },
    });
  }
}
