import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateArticleDto } from 'src/dto/article.dto';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import { IArticle } from 'src/interfaces/articles.interface';
import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IUserEntity } from 'src/interfaces/user.interface';
import ArticleService from 'src/services/article.service';
import { AuthToken } from 'src/shared/decorator/method';

@ApiBearerAuth()
@ApiTags('Article')
@Controller('articles')
class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiQuery({ name: 'pageCurrent', required: true })
  @ApiQuery({ name: 'pageSize', required: true })
  @ApiResponse({ status: 200, description: 'Response permission Array' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() pagination: IPaginationParams): Promise<IPaginationResponse<IArticle[]>> {
    return this.articleService.getAll(pagination);
  }

  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({ status: 200, description: 'Response resource was created' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@AuthToken() user: IUserEntity, @Body() resourceData: CreateArticleDto): Promise<IArticle> {
    return this.articleService.create(user, resourceData);
  }
}

export default ArticleController;
