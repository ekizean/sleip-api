import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { HealthStatusEnum } from '../horses.constants';

export class HorsesQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  @IsEnum(HealthStatusEnum)
  healthStatus?: string;
}
