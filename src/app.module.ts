/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { ENTITIES, MODULES } from './shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: '.env'}),
    ...MODULES,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: +process.env.DB_PORT ?? 5432,
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'aerolinea',
      entities: ENTITIES,
      dropSchema: process.env.DROP_SCHEMA === undefined ? true : process.env.DROP_SCHEMA === 'true',
      synchronize: process.env.SYNCHRONIZE === undefined ? true : process.env.SYNCHRONIZE === 'true',
      keepConnectionAlive: true
    }),AerolineaModule, AeropuertoModule],
  controllers: [AppController]
})
export class AppModule {}
