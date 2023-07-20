import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: 'permissionIds', isArray: true, type: 'number' })
  @IsNumber({}, { each: true })
  permissionIds: number[];
}

class UpdateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: 'permissionIds', isArray: true, type: 'number' })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  permissionIds: number[];
}

export { CreateRoleDto, UpdateRoleDto };
