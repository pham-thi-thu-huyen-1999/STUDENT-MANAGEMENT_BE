import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateResourceDto, UpdateResourceDto } from 'src/dto/resource.dto';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import type { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import type { IResource } from 'src/interfaces/resources.interface';
import ResourceService from 'src/services/resource.service';

@ApiBearerAuth()
@ApiTags('Resources')
@Controller('resources')
class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @ApiResponse({ status: 200, description: 'Response resource Array' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() pagination: IPaginationParams): Promise<IPaginationResponse<IResource[]>> {
    return this.resourceService.getAll(pagination);
  }

  @ApiResponse({ status: 200, description: 'Response resource by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOneById(@Param('id') id: number): Promise<IResource> {
    return this.resourceService.findOneById(id);
  }

  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({ status: 200, description: 'Response resource was created' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() resourceData: CreateResourceDto): Promise<IResource> {
    return this.resourceService.create(resourceData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateResourceDto })
  @ApiResponse({ status: 200, description: 'Response resource was updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() resourceData: UpdateResourceDto): Promise<IResource> {
    return this.resourceService.update(id, resourceData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Response resource was deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<IResource> {
    return this.resourceService.delete(id);
  }
}

export default ResourceController;
