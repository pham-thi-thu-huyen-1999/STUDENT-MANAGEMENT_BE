import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthController from 'src/controllers/auth.controller';
import UserRepository from 'src/repositories/user.repository';
import UserRoleRepository from 'src/repositories/userRole.repository';
import AuthService from 'src/services/auth.service';
import JwtStrategy from 'src/strategies/jwt.strategy';
import LocalStrategy from 'src/strategies/local.strategy';
import { SECRET } from 'src/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, UserRoleRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: SECRET,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserRepository, UserRoleRepository],
  exports: [AuthService],
})
class AuthModule {}

export default AuthModule;
