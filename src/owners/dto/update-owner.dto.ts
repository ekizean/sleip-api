import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateOwnerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
