import { Injectable } from '@nestjs/common';
import MenuUserMenuResourceEntity from 'src/entities/menuUserMenuResource';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class MenuUserMenuResourceRepository extends Repository<MenuUserMenuResourceEntity> {
  constructor(private dataSource: DataSource) {
    super(MenuUserMenuResourceEntity, dataSource.createEntityManager());
  }
}

export default MenuUserMenuResourceRepository;
