/* Modules imports */
import {CulturaGastronomicaRestauranteModule} from '../../cultura-gastronomica-restaurante/cultura-gastronomica-restaurante.module';
import {CulturaGastronomicaModule} from '../../cultura-gastronomica/cultura-gastronomica.module';
import {PaisModule} from '../../pais/pais.module';
import {ProductoModule} from '../../producto/producto.module';
import {RecetaModule} from '../../receta/receta.module';
import {RestauranteModule} from '../../restaurante/restaurante.module';
import {CategoriaModule} from '../../categoria/categoria.module';
import {EstrellaMichelinModule} from '../../estrella-michelin/estrella-michelin.module';
import {ProductoCategoriaModule} from '../../producto-categoria/producto-categoria.module';
import {RecetaProductoModule} from '../../receta-producto/receta-producto.module';
import {RestauranteEstrellaMichelinModule} from '../../restaurante-estrella-michelin/restaurante-estrella-michelin.module';
import {CulturaGastronomicaProductoModule} from '../../cultura-gastronomica-producto/cultura-gastronomica-producto.module';
import {CulturaGastronomicaPaisModule} from '../../cultura-gastronomica-pais/cultura-gastronomica-pais.module';
import {CulturaGastronomicaRecetaModule} from '../../cultura-gastronomica-receta/cultura-gastronomica-receta.module';
import {UserModule} from '../../user/user.module';
import {AuthModule} from '../../auth/auth.module';

/** Modules array to be passed in any configuration */
export const MODULES = [
  CulturaGastronomicaModule,
  PaisModule,
  ProductoModule,
  RecetaModule,
  RestauranteModule,
  CategoriaModule,
  EstrellaMichelinModule,
  RestauranteEstrellaMichelinModule,
  ProductoCategoriaModule,
  RecetaProductoModule,
  CulturaGastronomicaProductoModule,
  CulturaGastronomicaPaisModule,
  CulturaGastronomicaRestauranteModule,
  CulturaGastronomicaRecetaModule,
  AuthModule,
  UserModule
];
