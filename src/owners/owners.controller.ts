import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { OwnerIdParam } from './dto/owner-id.params';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@Controller({ path: 'owners', version: '1' })
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  createOwner(@Body() dto: CreateOwnerDto) {
    return this.ownersService.createOwner(dto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.VET)
  getOwner(@Param() { id }: OwnerIdParam) {
    return this.ownersService.getOwnerById(id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VET)
  getOwners() {
    return this.ownersService.getOwners();
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  updateOwner(
    @Param() { id }: OwnerIdParam,
    @Body() updateData: UpdateOwnerDto,
  ) {
    return this.ownersService.updateOwner(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  deleteOwner(@Param() { id }: OwnerIdParam) {
    return this.ownersService.deleteOwner(id);
  }
}
