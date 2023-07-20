import { Injectable } from '@nestjs/common';
import UserMenuUserEntity from 'src/entities/userMenuUser.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class UserMenuUserRepository extends Repository<UserMenuUserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserMenuUserEntity, dataSource.createEntityManager());
  }
}

export default UserMenuUserRepository;
