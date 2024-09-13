import {IsNotEmpty, IsString, MinLength} from 'class-validator';

export class AerolineaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaFundacion: string;

  @IsString()
  @IsNotEmpty()
  readonly paginaWeb: string;
}
