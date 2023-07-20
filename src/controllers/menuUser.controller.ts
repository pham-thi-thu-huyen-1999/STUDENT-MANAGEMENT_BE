import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMenuUserDto, UpdateMenuUserDto } from 'src/dto/menuUser.dto';

import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import type { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IMenuUser } from 'src/interfaces/menuUser.interface';
import MenuUserService from 'src/services/menuUser.service';

@ApiBearerAuth()
@ApiTags('MenuUser')
@Controller('menu-user')
class MenuUserController {
  constructor(private readonly menuUserService: MenuUserService) {}

  @ApiQuery({ name: 'pageCurrent', required: true })
  @ApiQuery({ name: 'pageSize', required: true })
  @ApiResponse({ status: 200, description: 'Response permission Array' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() pagination: IPaginationParams): Promise<IPaginationResponse<IMenuUser[]>> {
    return this.menuUserService.getAll(pagination);
  }

  @ApiResponse({ status: 200, description: 'Response permission by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOneById(@Param('id') id: number): Promise<IMenuUser> {
    return this.menuUserService.findOneById(id);
  }

  @ApiBody({ type: CreateMenuUserDto })
  @ApiResponse({ status: 200, description: 'Response permission was created' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() permissionData: CreateMenuUserDto): Promise<IMenuUser> {
    return this.menuUserService.create(permissionData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateMenuUserDto })
  @ApiResponse({ status: 200, description: 'Response permission was updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() permissionData: UpdateMenuUserDto): Promise<IMenuUser> {
    return this.menuUserService.update(id, permissionData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Response permission was deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<IMenuUser> {
    return this.menuUserService.delete(id);
  }
}

export default MenuUserController;
