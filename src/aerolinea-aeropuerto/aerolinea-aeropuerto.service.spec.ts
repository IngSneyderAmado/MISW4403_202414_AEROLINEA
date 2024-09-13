import {Test, TestingModule} from '@nestjs/testing';
import {AerolineaAeropuertoService} from './aerolinea-aeropuerto.service';
import {AerolineaEntity} from '../aerolinea/aerolinea.entity';
import {AeropuertoEntity} from '../aeropuerto/aeropuerto.entity';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
import {MESSAGES, TypeOrmTestingConfig} from '../shared';
import {getRepositoryToken} from '@nestjs/typeorm';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();
    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigo: faker.string.numeric(3),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: []
      } as AeropuertoEntity);
      aeropuertosList.push(aeropuerto);
    }
    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(1),
      fechaFundacion: faker.date.future().toISOString().split('T')[0],
      paginaWeb: faker.internet.url(),
      aeropuertos: aeropuertosList
    } as AerolineaEntity);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService]
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoAerolinea should add an Aeropuerto to a Aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.numeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    } as AeropuertoEntity);
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(1),
      fechaFundacion: faker.date.future().toISOString().split('T')[0],
      paginaWeb: faker.internet.url(),
      aeropuertos: aeropuertosList
    } as AerolineaEntity);
    const result: AerolineaEntity = await service.addAeropuertoToAerolinea(newAerolinea.id, newAeropuerto.id);
    expect(result.aeropuertos.length).toBe(6);
    expect(result.aeropuertos[5]).not.toBeNull();
    expect(result.aeropuertos[5].nombre).toBe(newAeropuerto.nombre);
  });

  it('addAeropuertoAerolinea should thrown exception for an invalid Aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(1),
      fechaFundacion: faker.date.future().toISOString().split('T')[0],
      paginaWeb: faker.internet.url(),
      aeropuertos: []
    } as AerolineaEntity);
    await expect(() => service.addAeropuertoToAerolinea(newAerolinea.id, '0')).rejects.toHaveProperty(
      'message',
      MESSAGES.AEROPUERTONOTFOUND
    );
  });

  it('addAeropuertoAerolinea should throw an exception for an invalid Aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.numeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    });
    await expect(() => service.addAeropuertoToAerolinea('0', newAeropuerto.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.AEROLINEANOTFOUND
    );
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should return Aeropuerto by Aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity = await service.findAeropuertoFromAerolinea(aerolinea.id, aeropuerto.id);
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an invalid Aeropuerto', async () => {
    await expect(() => service.findAeropuertoFromAerolinea(aerolinea.id, '0')).rejects.toHaveProperty(
      'message',
      MESSAGES.AEROPUERTONOTFOUND
    );
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an invalid Aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() => service.findAeropuertoFromAerolinea('0', aeropuerto.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.AEROLINEANOTFOUND
    );
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw an exception for an Aeropuerto not associated to the Aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.numeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    } as AeropuertoEntity);
    await expect(() => service.findAeropuertoFromAerolinea(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.AEROPUERTONOASSOCIATEDAEROLINEA
    );
  });

  it('findAeropuertoesByAerolineaId should return Aeropuertos by Aerolinea ', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAeropuertosFromAerolineas(aerolinea.id);
    expect(aeropuertos.length).toBe(5);
  });

  it('findAeropuertoesByAerolineaId should throw an exception for an invalid Aerolinea', async () => {
    await expect(() => service.findAeropuertosFromAerolineas('0')).rejects.toHaveProperty('message', MESSAGES.AEROLINEANOTFOUND);
  });

  it('associateAeropuertoesAerolinea should update Aeropuertoes list for a Aerolinea ', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.numeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city()
    } as AeropuertoEntity);
    const updatedAerolinea: AerolineaEntity = await service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);
    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
  });

  it('associateAeropuertoesAerolinea should throw an exception for an invalid Aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.numeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    } as AeropuertoEntity);
    await expect(() => service.updateAirportsFromAirline('0', [newAeropuerto])).rejects.toHaveProperty(
      'message',
      MESSAGES.AEROLINEANOTFOUND
    );
  });

  it('associateAeropuertoesAerolinea should throw an exception for an invalid Aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = '0';
    await expect(() => service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty(
      'message',
      MESSAGES.AEROPUERTONOTFOUND
    );
  });

  it('deleteAeropuertoAerolinea should remove an Aeropuerto from a Aerolinea', async () => {
    const Aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.deleteAirportFromAirline(aerolinea.id, Aeropuerto.id);
    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({
      where: {id: aerolinea.id},
      relations: ['aeropuertos']
    });
    const deletedAeropuerto: AeropuertoEntity = storedAerolinea.aeropuertos.find((a) => a.id === Aeropuerto.id);
    expect(deletedAeropuerto).toBeUndefined();
  });

  it('deleteAeropuertoAerolinea should thrown an exception for an invalid Aeropuerto', async () => {
    await expect(() => service.deleteAirportFromAirline(aerolinea.id, '0')).rejects.toHaveProperty('message', MESSAGES.AEROPUERTONOTFOUND);
  });

  it('deleteAeropuertoAerolinea should thrown an exception for an invalid Aerolinea', async () => {
    const Aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() => service.deleteAirportFromAirline('0', Aeropuerto.id)).rejects.toHaveProperty('message', MESSAGES.AEROLINEANOTFOUND);
  });

  it('deleteAeropuertoAerolinea should thrown an exception for an non asocciated Aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.numeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    } as AeropuertoEntity);
    await expect(() => service.deleteAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.AEROPUERTONOASSOCIATEDAEROLINEA
    );
  });
});
