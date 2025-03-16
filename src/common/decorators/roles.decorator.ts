import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export enum UserRole {
  ADMIN = 'admin',
  VET = 'vet',
}

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
