import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { HealthStatusEnum } from '../horses.constants';

export class UpdateHorseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsEnum(HealthStatusEnum)
  healthStatus?: HealthStatusEnum;

  @IsOptional()
  @IsString()
  owner?: string;
}
