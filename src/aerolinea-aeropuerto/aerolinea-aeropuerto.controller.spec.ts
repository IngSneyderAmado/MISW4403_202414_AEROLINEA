import {Test, TestingModule} from '@nestjs/testing';
import {AerolineaAeropuertoController} from './aerolinea-aeropuerto.controller';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
import {TypeOrmTestingConfig} from '../shared';
import {AerolineaEntity} from '../aerolinea/aerolinea.entity';
import {AeropuertoEntity} from '../aeropuerto/aeropuerto.entity';
import {AerolineaAeropuertoService} from './aerolinea-aeropuerto.service';
import {AeropuertoDto} from '../aeropuerto/aeropuerto.dto';
describe('AerolineaAeropuertoController', () => {
  let controller: AerolineaAeropuertoController;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineasList: AerolineaEntity[];
  let aeropuertoesList: AeropuertoEntity[];

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();
    aeropuertoesList = [];
    aerolineasList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigo: faker.string.numeric(3),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: []
      } as AeropuertoEntity);
      aeropuertoesList.push(aeropuerto);
    }
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await aerolineaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.paragraph(1),
        fechaFundacion: faker.date.future().toISOString().split('T')[0],
        paginaWeb: faker.internet.url(),
        aeropuertos: aeropuertoesList
      } as AerolineaEntity);
      aerolineasList.push(aerolinea);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
      controllers: [AerolineaAeropuertoController]
    }).compile();

    controller = module.get<AerolineaAeropuertoController>(AerolineaAeropuertoController);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a aeropuerto to aerolinea', async () => {
    const aerolineaId: string = aerolineasList[0].id;
    const aeropuertoId: string = aeropuertoesList[0].id;
    const aerolinea: AerolineaEntity = await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoId);
    expect(aerolinea.aeropuertos.length).toBe(6);
  });

  it('should get a aeropuerto of aerolinea', async () => {
    const aerolineaId: string = aerolineasList[0].id;
    const aeropuertoId: string = aeropuertoesList[0].id;
    await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoId);
    const aeropuerto: AeropuertoEntity = await controller.findAeropuertoByAerolineaIdAeropuertoId(aerolineaId, aeropuertoId);
    expect(aeropuerto.id).toBe(aeropuertoId);
  });

  it('should get all the aeropuertoes of aerolinea', async () => {
    const aerolineaId: string = aerolineasList[0].id;
    await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoesList[0].id);
    await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoesList[1].id);
    const aeropuertoes: AeropuertoEntity[] = await controller.findAeropuertosByAerolineaId(aerolineaId);
    expect(aeropuertoes.length).toBe(5);
  });

  it('should update the aeropuertoes of aerolinea', async () => {
    const aeropuertosDto: AeropuertoDto[] = [{...aeropuertoesList[2]}];
    const aerolineaId: string = aerolineasList[0].id;
    await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoesList[0].id);
    await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoesList[1].id);
    const aerolinea: AerolineaEntity = await controller.associateAeropuertosAerolinea(aeropuertosDto, aerolineaId);
    expect(aerolinea.aeropuertos.length).toBe(1);
    expect(aerolinea.aeropuertos[0].id).toBe(aeropuertoesList[2].id);
  });

  it('should delete a aeropuerto of aerolinea', async () => {
    const aerolineaId: string = aerolineasList[0].id;
    const aeropuertoId: string = aeropuertoesList[0].id;
    await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoesList[0].id);
    await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoesList[1].id);
    await controller.addAeropuertoAerolinea(aerolineaId, aeropuertoesList[2].id);
    await controller.deleteAeropuertoAerolinea(aerolineaId, aeropuertoId);
    const aeropuertoes: AeropuertoEntity[] = await controller.findAeropuertosByAerolineaId(aerolineaId);
    expect(aeropuertoes.length).toBe(4);
  });
});
