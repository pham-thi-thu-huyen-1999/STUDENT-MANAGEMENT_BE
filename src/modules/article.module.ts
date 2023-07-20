import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ArticleController from 'src/controllers/article.controller';
import ArticleRepository from 'src/repositories/article.repository';
import UserRepository from 'src/repositories/user.repository';
import ArticleService from 'src/services/article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleRepository, UserRepository])],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, UserRepository],
  exports: [ArticleService],
})
class ArticleModule {}

export default ArticleModule;
