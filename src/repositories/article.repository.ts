import { Injectable } from '@nestjs/common';
import ArticleEntity from 'src/entities/article.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class ArticleRepository extends Repository<ArticleEntity> {
  constructor(private dataSource: DataSource) {
    super(ArticleEntity, dataSource.createEntityManager());
  }
}

export default ArticleRepository;
