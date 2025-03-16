export enum HealthStatusEnum {
  HEALTHY = 'Healthy',
  INJURED = 'Injured',
  RECOVERING = 'Recovering',
  UNKNOWN = 'Unknown',
}

export class Horse {
  id: string;
  name: string;
  age: number;
  breed: string;
  healthStatus: HealthStatusEnum;
  owner: string;
  createdAt: string;
}
