import { Injectable } from '@nestjs/common';
import ResourceEntity from 'src/entities/resource.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class ResourceRepository extends Repository<ResourceEntity> {
  constructor(private dataSource: DataSource) {
    super(ResourceEntity, dataSource.createEntityManager());
  }
}

export default ResourceRepository;
