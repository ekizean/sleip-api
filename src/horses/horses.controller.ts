import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { HorsesService } from './horses.service';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { CreateHorseDto } from './dto/create-horse.dto';
import { UpdateHorseDto } from './dto/update-horse.dto';
import { HorsesQuery } from './dto/horses.query';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';
import { HorseIdParam } from './dto/horse-id.params';

@Controller({ path: 'horses', version: '1' })
export class HorsesController {
  constructor(private readonly horsesService: HorsesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  createHorse(@Body() dto: CreateHorseDto) {
    return this.horsesService.createHorse(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VET)
  getHorses(@Query() query: HorsesQuery) {
    return this.horsesService.getHorses(query);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  updateHorse(
    @Param() { id }: HorseIdParam,
    @Body() updateData: UpdateHorseDto,
  ) {
    return this.horsesService.updateHorse(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  deleteHorse(@Param() { id }: HorseIdParam) {
    return this.horsesService.deleteHorse(id);
  }

  @Patch(':id/health')
  @Roles(UserRole.VET)
  updateHealth(
    @Param() { id }: HorseIdParam,
    @Body() healthStatus: UpdateHealthStatusDto,
  ) {
    return this.horsesService.updateHorse(id, healthStatus);
  }
}
