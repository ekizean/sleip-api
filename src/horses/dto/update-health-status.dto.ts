import { IsEnum } from 'class-validator';
import { HealthStatusEnum } from '../horses.constants';

export class UpdateHealthStatusDto {
  @IsEnum(HealthStatusEnum)
  healthStatus: HealthStatusEnum;
}
