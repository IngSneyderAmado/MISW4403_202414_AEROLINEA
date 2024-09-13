/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import {faker} from '@faker-js/faker';
import { MESSAGES, TypeOrmTestingConfig } from '../shared';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[];

  const seedDatabase = async (): Promise<void> => {
    repository.clear();
    aeropuertoList = [];
    for (let i = 0; i < 5; i++) {
      const aeropueto: AeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.string.numeric(3),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: [],
      } as AeropuertoEntity);
      aeropuertoList.push(aeropueto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aeropuertoes', async () => {
    const aeropuertoes: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertoes).not.toBeNull();
    expect(aeropuertoes).toHaveLength(aeropuertoList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre);
  });

  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', MESSAGES.AEROPUERTONOTFOUND);
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: '',
      nombre: faker.company.name(),
        codigo: faker.string.numeric(3),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: [],
    };
    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAeropuerto.id}});
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre);
  });

  it('update should modify a Aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto.nombre = 'New name';
    const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: aeropuerto.id}});
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre);
  });

  it('update should throw an exception for an invalid Aeropuerto', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {...aeropuerto, nombre: 'New name'};
    await expect(() => service.update('0', aeropuerto)).rejects.toHaveProperty('message', MESSAGES.AEROPUERTONOTFOUND);
  });

  it('delete should remove a Aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    const deletedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: aeropuerto.id}});
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid Aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', MESSAGES.AEROPUERTONOTFOUND);
  });

  
});
