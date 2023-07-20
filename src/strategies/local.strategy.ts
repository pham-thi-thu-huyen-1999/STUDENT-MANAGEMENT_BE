import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import AuthService from 'src/services/auth.service';
import { buildError } from 'src/utils/functions/builds';
import * as crypto from 'crypto';
import UserEntity from 'src/entities/user.entity';

@Injectable()
class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      // passReqToCallback: true,
    });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.authService.findByEmail(email);
    const passwordCrypto = crypto.createHmac('sha256', password).digest('hex');

    if (!user) {
      return buildError({
        errors: [{ email: 'This email is not exist' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (passwordCrypto !== user.password) {
      return buildError({
        errors: [{ password: 'This password was wrong' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return user;
  }
}

export default LocalStrategy;
