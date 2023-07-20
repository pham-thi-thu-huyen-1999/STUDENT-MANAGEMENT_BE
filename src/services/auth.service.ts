import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import * as crypto from 'crypto';
import { LoginDto } from 'src/dto/user.dto';
import { RegisterUserDto } from 'src/dto/user.dto';
import UserEntity from 'src/entities/user.entity';
import { ILogin, IRegister } from 'src/interfaces/auth.interface';
import { IUser, IUserEntity, IUserInfo } from 'src/interfaces/user.interface';
import UserRepository from 'src/repositories/user.repository';
import UserRoleRepository from 'src/repositories/userRole.repository';
import { buildMessageErrors, buildError } from 'src/utils/functions/builds';

@Injectable()
class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(data: LoginDto): Promise<UserEntity> {
    const findOneOptions = {
      email: data.email,
      password: crypto.createHmac('sha256', data.password).digest('hex'),
    };

    return this.userRepository.findOne({ where: findOneOptions });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async login(data: LoginDto): Promise<ILogin> {
    const user = await this.findOne(data);
    console.log(user);
    if (!user) {
      return buildError({
        errors: [{ user: 'User does not exist' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const accessToken = await this.generateJWT(user);

    return { accessToken };
  }

  async register(dto: RegisterUserDto): Promise<IRegister> {
    const { avatar, email, firstName, lastName, password } = dto;
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      return buildError({
        errors: [{ email: 'This email is exists' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const newUser = new UserEntity();
    newUser.email = email;
    newUser.password = password;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.avatar = avatar;
    const errors = await validate(newUser);

    if (errors.length > 0) {
      return buildError({
        errors: buildMessageErrors(errors),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const userData = await this.userRepository.save(newUser);

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      created: userData.created,
      updated: userData.updated,
    };
  }

  public async generateJWT(user: any): Promise<string> {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
  }

  async getInfo(user: IUserEntity): Promise<IUserInfo> {
    const userData = await this.userRepository.findOne({ where: { email: user.email } });
    const userRoleData = await this.userRoleRepository.find({ where: { userId: user.id } });

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      created: userData.created,
      updated: userData.updated,
      roleIds: userRoleData.map((userRole) => userRole.roleId),
    };
  }
}

export default AuthService;
