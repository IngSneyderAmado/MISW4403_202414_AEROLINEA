import {Test, TestingModule} from '@nestjs/testing';
import {AerolineaController} from './aerolinea.controller';
import {AerolineaEntity} from './aerolinea.entity';
import {Repository} from 'typeorm';
import {BusinessError, BusinessErrorsInterceptor, TypeOrmTestingConfig} from '../shared';
import {faker} from '@faker-js/faker';
import {AerolineaService} from './aerolinea.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CallHandler, ExecutionContext, HttpException, HttpStatus} from '@nestjs/common';
import {throwError} from 'rxjs';
describe('AerolineaController', () => {
  let controller: AerolineaController;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];
  let interceptor: BusinessErrorsInterceptor;
  const aerolineaMock: AerolineaEntity = {
    nombre: faker.company.name(),
    descripcion: faker.lorem.paragraph(1),
    fechaFundacion: faker.date.past().toISOString().split('T')[0],
    paginaWeb: faker.internet.url(),
    aeropuertos: []
  } as AerolineaEntity;

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await repository.save({...aerolineaMock} as AerolineaEntity);
      aerolineasList.push(aerolinea);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService, BusinessErrorsInterceptor],
      controllers: [AerolineaController]
    }).compile();

    controller = module.get<AerolineaController>(AerolineaController);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    interceptor = module.get<BusinessErrorsInterceptor>(BusinessErrorsInterceptor);
    await seedDatabase();
  });

  describe('controller', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
    it('should return all aerolinea', async () => {
      const aerolineas: AerolineaEntity[] = await controller.findAll();
      expect(aerolineas.length).toBe(aerolineasList.length);
    });

    it('should return the first aerolinea', async () => {
      const aerolinea: AerolineaEntity = await controller.findOne(aerolineasList[0].id);
      expect(aerolinea.nombre).toBe(aerolineasList[0].nombre);
    });

    it('should create a aerolinea', async () => {
      const aerolinea: AerolineaEntity = {...aerolineaMock} as AerolineaEntity;
      const categoriaCreated: AerolineaEntity = await controller.create(aerolinea);
      expect(categoriaCreated).not.toBeNull();
    });

    it('should update the first aerolinea', async () => {
      const aerolinea: AerolineaEntity = {...aerolineaMock, nombre: 'new aerolinea name'} as AerolineaEntity;
      const categoriaUpdate: AerolineaEntity = await controller.update(aerolineasList[0].id, aerolinea);
      expect(categoriaUpdate.nombre).toBe(aerolinea.nombre);
    });

    it('should delete a aerolinea', async () => {
      await controller.delete(aerolineasList[0].id);
      const categorias: AerolineaEntity[] = await controller.findAll();
      expect(categorias.length).toBe(4);
    });
  });
  describe('interceptor', () => {
    it('should be defined', () => {
      expect(interceptor).toBeDefined();
    });

    it('should handle BusinessError.NOT_FOUND correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.NOT_FOUND, message: 'Resource not found'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should handle BusinessError.PRECONDITION_FAILED correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.PRECONDITION_FAILED, message: 'Precondition failed'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should handle BusinessError.BAD_REQUEST correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.BAD_REQUEST, message: 'Bad request'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should rethrow unexpected errors', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: 'UNKNOWN_ERROR', message: 'Unknown error'};
      const callHandler: CallHandler = {
        handle: () => throwError(() => error)
      };
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        }
      });
    });
  });
});
