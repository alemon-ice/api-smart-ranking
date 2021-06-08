import { Module } from '@nestjs/common';
// import config, { IConfig } from 'config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

// const dbConfig: IConfig = config.get('App.database');

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27028/smart-ranking', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
