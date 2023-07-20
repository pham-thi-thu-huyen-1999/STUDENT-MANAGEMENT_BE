import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

class CreateMenuUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ name: 'menuUserIds', isArray: true, type: 'number' })
  @IsNumber({}, { each: true })
  menuUserIds: number[];
}
class UpdateMenuUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ name: 'menuUserIds', isArray: true, type: 'number' })
  @IsNumber({}, { each: true })
  menuUserIds: number[];
}

export { CreateMenuUserDto, UpdateMenuUserDto };
