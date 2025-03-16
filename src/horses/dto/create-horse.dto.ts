import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { HealthStatusEnum } from '../horses.constants';

export class CreateHorseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  breed: string;

  @IsEnum(HealthStatusEnum)
  healthStatus: HealthStatusEnum;

  @IsString()
  @IsNotEmpty()
  owner: string;
}
