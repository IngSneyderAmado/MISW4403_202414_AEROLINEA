import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {BusinessError, BusinessLogicException, MESSAGES} from '../shared';
import {AeropuertoEntity} from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
  /** Service constructor */
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>
  ) {}

  /**
   * Get all the aeropuerto
   * @returns {Promise<AeropuertoEntity[]>} aeropuertos
   */
  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoRepository.find();
  }

  /**
   * Get one aeropuerto by its id
   * @param {string} id aeropuerto identity (id)
   * @returns {Promise<AeropuertoEntity>} aeropuerto if it exist
   */
  async findOne(id: string): Promise<AeropuertoEntity> {
    const culturaGastronoica: AeropuertoEntity = await this.aeropuertoRepository.findOne({
      where: {id}
    });
    if (!culturaGastronoica) throw new BusinessLogicException(MESSAGES.AEROPUERTONOTFOUND, BusinessError.NOT_FOUND);
    return culturaGastronoica;
  }

  /**
   * Create a aeropuerto
   * @param {AeropuertoEntity} aeropuerto aeropuerto DTO to create the entity in the DB
   * @returns {Promise<AeropuertoEntity>} the aeropuerto that has been created
   */
  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    return await this.aeropuertoRepository.save(aeropuerto);
  }

  /**
   * Update a aeropuerto
   * @param {string} id aeropuerto identity (id)
   * @param {AeropuertoEntity} aeropuerto aeropuerto DTO to update the entity in the DB
   * @returns {Promise<AeropuertoEntity>} the aeropuerto that has been updated
   */
  async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    const persistedAeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}});
    if (!persistedAeropuerto) throw new BusinessLogicException(MESSAGES.AEROPUERTONOTFOUND, BusinessError.NOT_FOUND);
    return await this.aeropuertoRepository.save({...persistedAeropuerto, ...aeropuerto});
  }

  /**
   * delete a aeropuerto
   * @param {string} id aeropuerto identity (id)
   */
  async delete(id: string): Promise<void> {
    const culturaGastronoica: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}});
    if (!culturaGastronoica) throw new BusinessLogicException(MESSAGES.AEROPUERTONOTFOUND, BusinessError.NOT_FOUND);
    await this.aeropuertoRepository.remove(culturaGastronoica);
  }
}
