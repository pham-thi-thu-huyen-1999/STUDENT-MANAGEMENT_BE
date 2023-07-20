import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto, UpdatePermissionDto } from 'src/dto/permission.dto';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import type { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import type { IPermission } from 'src/interfaces/permissions.interface';
import PermissionService from 'src/services/permission.service';

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiResponse({ status: 200, description: 'Response permission Array' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() pagination: IPaginationParams): Promise<IPaginationResponse<IPermission[]>> {
    return this.permissionService.getAll(pagination);
  }

  @ApiResponse({ status: 200, description: 'Response permission by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOneById(@Param('id') id: number): Promise<IPermission> {
    return this.permissionService.findOneById(id);
  }

  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 200, description: 'Response permission was created' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() permissionData: CreatePermissionDto): Promise<IPermission> {
    return this.permissionService.create(permissionData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({ status: 200, description: 'Response permission was updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() permissionData: UpdatePermissionDto): Promise<IPermission> {
    return this.permissionService.update(id, permissionData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Response permission was deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<IPermission> {
    return this.permissionService.delete(id);
  }
}

export default PermissionController;
