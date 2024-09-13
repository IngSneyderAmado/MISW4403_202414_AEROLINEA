/* Modules imports */
import {AerolineaAeropuertoModule} from 'src/aerolinea-aeropuerto/aerolinea-aeropuerto.module';
import {AerolineaModule} from '../../aerolinea/aerolinea.module';
import {AeropuertoModule} from '../../aeropuerto/aeropuerto.module';

/** Modules array to be passed in any configuration */
export const MODULES = [AerolineaModule, AeropuertoModule, AerolineaAeropuertoModule];
