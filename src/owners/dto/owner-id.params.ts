import { IsString } from 'class-validator';

export class OwnerIdParam {
  @IsString()
  id: string;
}
