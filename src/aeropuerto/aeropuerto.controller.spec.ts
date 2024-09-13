import {Test, TestingModule} from '@nestjs/testing';
import {AeropuertoController} from './aeropuerto.controller';
import {Repository} from 'typeorm';
import {AeropuertoEntity} from './aeropuerto.entity';
import {faker} from '@faker-js/faker';
import {BusinessErrorsInterceptor, TypeOrmTestingConfig} from '../shared';
import {AeropuertoService} from './aeropuerto.service';
import {getRepositoryToken} from '@nestjs/typeorm';
describe('AeropuertoController', () => {
  let controller: AeropuertoController;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[];
  const aeropuertoMock: AeropuertoEntity = {
    nombre: faker.company.name(),
    codigo: faker.string.numeric(3),
    pais: faker.location.country(),
    ciudad: faker.location.city(),
    aerolineas: []
  } as AeropuertoEntity;
  const seedDatabase = async () => {
    repository.clear();
    aeropuertoList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await repository.save({...aeropuertoMock} as AeropuertoEntity);
      aeropuertoList.push(aeropuerto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService, BusinessErrorsInterceptor],
      controllers: [AeropuertoController]
    }).compile();

    controller = module.get<AeropuertoController>(AeropuertoController);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all aeropuerto', async () => {
    const aeropuertoes: AeropuertoEntity[] = await controller.findAll();
    expect(aeropuertoes.length).toBe(aeropuertoList.length);
  });

  it('should return the first aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = await controller.findOne(aeropuertoList[0].id);
    expect(aeropuerto.nombre).toBe(aeropuertoList[0].nombre);
  });

  it('should create a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {...aeropuertoMock} as AeropuertoEntity;
    const aeropuertoCreated: AeropuertoEntity = await controller.create(aeropuerto);
    expect(aeropuertoCreated).not.toBeNull();
  });

  it('should update the first aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {...aeropuertoMock, nombre: 'new producto name'} as AeropuertoEntity;
    const aeropuertoUpdate: AeropuertoEntity = await controller.update(aeropuertoList[0].id, aeropuerto);
    expect(aeropuertoUpdate.nombre).toBe(aeropuerto.nombre);
  });

  it('should delete a aeropuerto', async () => {
    await controller.delete(aeropuertoList[0].id);
    const aeropuertoes: AeropuertoEntity[] = await controller.findAll();
    expect(aeropuertoes.length).toBe(4);
  });
});
