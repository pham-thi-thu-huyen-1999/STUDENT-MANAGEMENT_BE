import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from 'src/dto/role.dto';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IRole } from 'src/interfaces/role.interface';
import RoleService from 'src/services/role.service';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiQuery({ name: 'pageCurrent', required: true })
  @ApiQuery({ name: 'pageSize', required: true })
  @ApiResponse({ status: 200, description: 'Response role array' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() pagination: IPaginationParams): Promise<IPaginationResponse<IRole[]>> {
    return this.roleService.getAll(pagination);
  }

  @ApiResponse({ status: 200, description: 'Response permission by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOneById(@Param('id') id: number): Promise<IRole> {
    return this.roleService.findOneById(id);
  }

  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 200, description: 'Response role was created' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() roleData: CreateRoleDto): Promise<IRole> {
    return this.roleService.create(roleData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Response role was updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() roleData: UpdateRoleDto): Promise<IRole> {
    return this.roleService.update(id, roleData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Response role was deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<IRole> {
    return this.roleService.delete(id);
  }
}

export default RoleController;
