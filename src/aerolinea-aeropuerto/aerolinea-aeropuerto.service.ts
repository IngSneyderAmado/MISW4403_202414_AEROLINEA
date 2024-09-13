import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {AerolineaEntity} from '../aerolinea/aerolinea.entity';
import {Repository} from 'typeorm';
import {AeropuertoEntity} from '../aeropuerto/aeropuerto.entity';
import {BusinessError, BusinessLogicException, MESSAGES} from '../shared';

@Injectable()
export class AerolineaAeropuertoService {
  private relations: string[] = ['aeropuertos'];

  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>
  ) {}

  async addAeropuertoToAerolinea(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
    const aeropueto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
    if (!aeropueto) throw new BusinessLogicException(MESSAGES.AEROPUERTONOTFOUND, BusinessError.NOT_FOUND);
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: this.relations});
    if (!aerolinea) throw new BusinessLogicException(MESSAGES.AEROLINEANOTFOUND, BusinessError.NOT_FOUND);
    aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropueto];
    return await this.aerolineaRepository.save(aerolinea);
  }

  async findAeropuertosFromAerolineas(aerolineaId: string): Promise<AeropuertoEntity[]> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: this.relations});
    if (!aerolinea) throw new BusinessLogicException(MESSAGES.AEROLINEANOTFOUND, BusinessError.NOT_FOUND);
    return aerolinea.aeropuertos;
  }

  async findAeropuertoFromAerolinea(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
    const aeropueto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
    if (!aeropueto) throw new BusinessLogicException(MESSAGES.AEROPUERTONOTFOUND, BusinessError.NOT_FOUND);
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: this.relations});
    if (!aerolinea) throw new BusinessLogicException(MESSAGES.AEROLINEANOTFOUND, BusinessError.NOT_FOUND);
    const aeropuertoAerolinea: AeropuertoEntity = aerolinea.aeropuertos.find((e) => e.id === aeropueto.id);
    if (!aeropuertoAerolinea) throw new BusinessLogicException(MESSAGES.AEROPUERTONOASSOCIATEDAEROLINEA, BusinessError.PRECONDITION_FAILED);
    return aeropuertoAerolinea;
  }

  async updateAirportsFromAirline(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: this.relations});
    if (!aerolinea) throw new BusinessLogicException(MESSAGES.AEROLINEANOTFOUND, BusinessError.NOT_FOUND);
    for (const thisAeropuerto of aeropuertos) {
      const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: thisAeropuerto.id}});
      if (!aeropuerto) throw new BusinessLogicException(MESSAGES.AEROPUERTONOTFOUND, BusinessError.NOT_FOUND);
    }
    aerolinea.aeropuertos = aeropuertos;
    return await this.aerolineaRepository.save(aerolinea);
  }

  async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<void> {
    const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
    if (!aeropuerto) throw new BusinessLogicException(MESSAGES.AEROPUERTONOTFOUND, BusinessError.NOT_FOUND);
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: this.relations});
    if (!aerolinea) throw new BusinessLogicException(MESSAGES.AEROLINEANOTFOUND, BusinessError.NOT_FOUND);
    const aeropuertoAerolinea: AeropuertoEntity = aerolinea.aeropuertos.find((e) => e.id === aeropuerto.id);
    if (!aeropuertoAerolinea) throw new BusinessLogicException(MESSAGES.AEROPUERTONOASSOCIATEDAEROLINEA, BusinessError.PRECONDITION_FAILED);
    aerolinea.aeropuertos = aerolinea.aeropuertos.filter((e) => e.id !== aeropuertoId);
    await this.aerolineaRepository.save(aerolinea);
  }
}
