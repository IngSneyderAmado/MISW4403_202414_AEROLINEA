import {Module} from '@nestjs/common';
import {AerolineaAeropuertoService} from './aerolinea-aeropuerto.service';
import {AerolineaEntity} from '../aerolinea/aerolinea.entity';
import {AeropuertoEntity} from '../aeropuerto/aeropuerto.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AerolineaService} from '../aerolinea/aerolinea.service';
import {AeropuertoService} from '../aeropuerto/aeropuerto.service';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  providers: [AerolineaService, AeropuertoService, AerolineaAeropuertoService],
  controllers: [AerolineaAeropuertoController]
})
export class AerolineaAeropuertoModule {}
