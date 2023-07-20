import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly avatar: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

class UpdateUserDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly avatar: string;

  @ApiProperty({ name: 'roleIds', isArray: true, type: 'number' })
  // @IsNumber({}, { each: true })
  readonly roleIds?: number[];

  @ApiProperty()
  readonly menuUserId: number;
}

export { LoginDto, RegisterUserDto, UpdateUserDto };
