import { Injectable } from '@nestjs/common';
import MenuResourceEntity from 'src/entities/menuResource.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class MenuResourceRepository extends Repository<MenuResourceEntity> {
  constructor(private dataSource: DataSource) {
    super(MenuResourceEntity, dataSource.createEntityManager());
  }
}

export default MenuResourceRepository;
