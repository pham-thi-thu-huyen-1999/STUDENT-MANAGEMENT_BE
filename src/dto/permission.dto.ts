import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import ResourceEntity from 'src/entities/resource.entity';

class CreatePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: 'resourceIds', isArray: true, type: 'number' })
  @IsNumber({}, { each: true })
  resourceIds: number[];
}

class UpdatePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: 'resourceIds', isArray: true, type: 'number' })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  resourceIds: number[];
}

export { CreatePermissionDto, UpdatePermissionDto };
