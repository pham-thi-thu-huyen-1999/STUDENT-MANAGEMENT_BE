import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dto/user.dto';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IUser } from 'src/interfaces/user.interface';
import UsersService from 'src/services/user.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
class UserController {
  constructor(private readonly usersService: UsersService) {}

  @ApiQuery({ name: 'pageCurrent', required: true })
  @ApiQuery({ name: 'pageSize', required: true })
  @ApiResponse({ status: 200, description: 'Response user array' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() pagination: IPaginationParams): Promise<IPaginationResponse<IUser[]>> {
    return this.usersService.getAll(pagination);
  }

  @ApiResponse({ status: 200, description: 'Response permission by id' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOneById(@Param('id') id: number): Promise<IUser> {
    return this.usersService.findOneById(id);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Response user was updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() userData: UpdateUserDto): Promise<IUser> {
    return this.usersService.updateUser(id, userData);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Response user was deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<IUser> {
    return this.usersService.delete(id);
  }
}

export default UserController;
