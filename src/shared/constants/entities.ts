/* Entities imports */
import {CulturaGastronomicaEntity} from '../../cultura-gastronomica/cultura-gastronomica.entity';
import {PaisEntity} from '../../pais/pais.entity';
import {ProductoEntity} from '../../producto/producto.entity';
import {RecetaEntity} from '../../receta/receta.entity';
import {RestauranteEntity} from '../../restaurante/restaurante.entity';
import {EstrellaMichelinEntity} from '../../estrella-michelin/estrella-michelin.entity';
import {CategoriaEntity} from '../../categoria/categoria.entity';

/** Entities array to be passed in any configuration */
export const ENTITIES = [
  CulturaGastronomicaEntity,
  PaisEntity,
  ProductoEntity,
  RecetaEntity,
  RestauranteEntity,
  CategoriaEntity,
  EstrellaMichelinEntity
];
