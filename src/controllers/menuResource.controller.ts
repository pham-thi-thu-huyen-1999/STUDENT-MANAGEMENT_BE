import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMenuResourceDto, UpdateMenuResourceDto } from 'src/dto/menuResource.dto';

import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import type { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IMenuResource } from 'src/interfaces/menuResource.interface';
import MenuResourceService from 'src/services/menuResource.service';

@ApiBearerAuth()
@ApiTags('MenuResource')
@Controller('menu-resource')
class MenuResourceController {
  constructor(private readonly menuResourceService: MenuResourceService) {}

  @ApiQuery({ name: 'pageCurrent', required: true })
  @ApiQuery({ name: 'pageSize', required: true })
  @ApiResponse({ status: 200, description: 'Response resource Array' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() pagination: IPaginationParams): Promise<IPaginationResponse<IMenuResource[]>> {
    return this.menuResourceService.getAll(pagination);
  }

  @ApiResponse({ status: 200, description: 'Response resource by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOneById(@Param('id') id: number): Promise<IMenuResource> {
    return this.menuResourceService.findOneById(id);
  }

  @ApiBody({ type: CreateMenuResourceDto })
  @ApiResponse({ status: 200, description: 'Response resource was created' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() resourceData: CreateMenuResourceDto): Promise<IMenuResource> {
    return this.menuResourceService.create(resourceData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateMenuResourceDto })
  @ApiResponse({ status: 200, description: 'Response resource was updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() resourceData: UpdateMenuResourceDto): Promise<IMenuResource> {
    return this.menuResourceService.update(id, resourceData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Response resource was deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<IMenuResource> {
    return this.menuResourceService.delete(id);
  }
}

export default MenuResourceController;
