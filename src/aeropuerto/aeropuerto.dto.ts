import {IsNotEmpty, IsString, Length, MinLength} from 'class-validator';

export class AeropuertoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(3)
  readonly codigo: string;

  @IsString()
  @IsNotEmpty()
  readonly pais: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;
}
