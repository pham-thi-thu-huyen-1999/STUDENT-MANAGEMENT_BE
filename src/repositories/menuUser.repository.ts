import { Injectable } from '@nestjs/common';
import MenuUserEntity from 'src/entities/menuUser';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class MenuUserRepository extends Repository<MenuUserEntity> {
  constructor(private dataSource: DataSource) {
    super(MenuUserEntity, dataSource.createEntityManager());
  }
}

export default MenuUserRepository;
