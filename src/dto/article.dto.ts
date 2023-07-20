import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly label: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly content: string;
}

export { CreateArticleDto };
