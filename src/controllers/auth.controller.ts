import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import LocalAuthGuard from 'src/guards/local-auth.guard';
import { LoginDto } from 'src/dto/user.dto';
import { RegisterUserDto } from 'src/dto/user.dto';
import AuthService from 'src/services/auth.service';
import { ILogin, IRegister } from 'src/interfaces/auth.interface';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import { AuthToken } from 'src/shared/decorator/method';
import { IUserEntity, IUserInfo } from 'src/interfaces/user.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 200, description: 'Response User' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('register')
  async register(@Body() data: RegisterUserDto): Promise<IRegister> {
    return this.authService.register(data);
  }

  // @ApiOperation({ summary: 'Api Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Response access token' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() data: LoginDto): Promise<ILogin> {
    return this.authService.login(data);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Response info user' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/user-info')
  @UseGuards(JwtAuthGuard)
  async getInfo(@AuthToken() user: IUserEntity): Promise<IUserInfo> {
    return this.authService.getInfo(user);
  }
}

export default AuthController;
