import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class CreateMenuResourceDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly iconType: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly iconName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly path: string;
}

class UpdateMenuResourceDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly iconType: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly iconName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly path: string;
}

export { CreateMenuResourceDto, UpdateMenuResourceDto };
