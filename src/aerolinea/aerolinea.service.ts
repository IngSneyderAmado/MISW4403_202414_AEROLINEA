import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {AerolineaEntity} from './aerolinea.entity';
import {BusinessError, BusinessLogicException, MESSAGES} from '../shared';

@Injectable()
export class AerolineaService {
  private relations: string[] = ['aeropuertos'];
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>
  ) {}

  async findAll(): Promise<AerolineaEntity[]> {
    return await this.aerolineaRepository.find({relations: this.relations});
  }

  async findOne(id: string): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: this.relations});
    if (!aerolinea) throw new BusinessLogicException(MESSAGES.AEROLINEANOTFOUND, BusinessError.NOT_FOUND);
    return aerolinea;
  }

  async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    return await this.aerolineaRepository.save(aerolinea);
  }

  async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    const persistAerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}});
    if (!persistAerolinea) throw new BusinessLogicException(MESSAGES.AEROLINEANOTFOUND, BusinessError.NOT_FOUND);
    return await this.aerolineaRepository.save({...persistAerolinea, ...aerolinea});
  }

  async delete(id: string): Promise<void> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}});
    if (!aerolinea) throw new BusinessLogicException(MESSAGES.AEROLINEANOTFOUND, BusinessError.NOT_FOUND);
    await this.aerolineaRepository.remove(aerolinea);
  }
}
