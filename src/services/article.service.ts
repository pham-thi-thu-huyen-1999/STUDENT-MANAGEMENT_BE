import { HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateArticleDto } from 'src/dto/article.dto';
import ArticleEntity from 'src/entities/article.entity';
import type { IArticle } from 'src/interfaces/articles.interface';
import type { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import type { IUserEntity } from 'src/interfaces/user.interface';
import ArticleRepository from 'src/repositories/article.repository';
import UserRepository from 'src/repositories/user.repository';
import { buildError, buildMessageErrors } from 'src/utils/functions/builds';
import { handleTotalPage } from 'src/utils/functions/handle';

@Injectable()
class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository, private readonly userRepository: UserRepository) {}

  async getAll(params: IPaginationParams): Promise<IPaginationResponse<IArticle[]>> {
    const { pageCurrent, pageSize } = params;

    const start = Number(pageCurrent) - 1;
    const end = Number(pageSize);

    const articleData = await this.articleRepository.find();

    const articles = articleData.slice(start * end, start * end + end);

    const articleResult: IArticle[] = [];

    for await (const article of articles) {
      const userData = await this.userRepository.findOne({ where: { id: article.userId }, relations: ['articles'] });

      articleResult.push({
        content: article.content,
        id: article.id,
        label: article.label,
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      });
    }

    return {
      list: articleResult,
      paging: {
        pageCurrent: start + 1,
        pageSize: end,
        totalPage: handleTotalPage(articleData.length, end),
        totalSize: articleData.length,
      },
    };
  }

  async create(user: IUserEntity, dto: CreateArticleDto): Promise<IArticle> {
    const userData = await this.userRepository.findOne({ where: { id: user.id } });

    const newArticle = new ArticleEntity();
    newArticle.label = dto.label;
    newArticle.content = dto.content;
    newArticle.user = userData;

    const errors = await validate(newArticle);

    if (errors.length > 0) {
      return buildError({
        errors: buildMessageErrors(errors),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const article = await this.articleRepository.save(newArticle);

    return {
      content: article.content,
      id: article.id,
      label: article.label,
      user: {
        id: article.user.id,
        email: article.user.email,
        firstName: article.user.firstName,
        lastName: article.user.lastName,
      },
    };
  }
}

export default ArticleService;
