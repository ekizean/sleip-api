import { IsString } from 'class-validator';

export class HorseIdParam {
  @IsString()
  id: string;
}
