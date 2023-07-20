import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import AuthService from 'src/services/auth.service';
import { SECRET } from 'src/utils/constants';
import { buildError } from 'src/utils/functions/builds';

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET,
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    const user = await this.authService.findByEmail(email);

    if (!user) {
      return buildError({
        errors: [{ email: 'This email is exists' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return user;
  }
}

export default JwtStrategy;
