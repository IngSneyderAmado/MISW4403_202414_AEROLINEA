import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {BusinessErrorsInterceptor} from '../shared';
import {AerolineaAeropuertoService} from './aerolinea-aeropuerto.service';
import {AerolineaEntity} from '../aerolinea/aerolinea.entity';
import {AeropuertoEntity} from '../aeropuerto/aeropuerto.entity';
import {AeropuertoDto} from '../aeropuerto/aeropuerto.dto';
import {plainToInstance} from 'class-transformer';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
  constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService) {}

  @Post(':aerolineaId/airports/:aeropuertoId')
  async addAeropuertoAerolinea(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string
  ): Promise<AerolineaEntity> {
    return await this.aerolineaAeropuertoService.addAeropuertoToAerolinea(aerolineaId, aeropuertoId);
  }

  @Get(':aerolineaId/airports/:aeropuertoId')
  async findAeropuertoByAerolineaIdAeropuertoId(
    @Param('aerolineaId') aerolineaId: string,
    @Param('aeropuertoId') aeropuertoId: string
  ): Promise<AeropuertoEntity> {
    return await this.aerolineaAeropuertoService.findAeropuertoFromAerolinea(aerolineaId, aeropuertoId);
  }

  @Get(':aerolineaId/airports')
  async findAeropuertosByAerolineaId(@Param('aerolineaId') aerolineaId: string): Promise<AeropuertoEntity[]> {
    return await this.aerolineaAeropuertoService.findAeropuertosFromAerolineas(aerolineaId);
  }

  @Put(':aerolineaId/airports')
  async associateAeropuertosAerolinea(
    @Body() aeropuertosDto: AeropuertoDto[],
    @Param('aerolineaId') aerolineaId: string
  ): Promise<AerolineaEntity> {
    const aeropuerto = plainToInstance(AeropuertoEntity, aeropuertosDto);
    return await this.aerolineaAeropuertoService.updateAirportsFromAirline(aerolineaId, aeropuerto);
  }

  @Delete(':aerolineaId/airports/:aeropuertoId')
  @Delete(':aerolineaId')
  @HttpCode(204)
  async deleteAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string): Promise<void> {
    return await this.aerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
  }
}
