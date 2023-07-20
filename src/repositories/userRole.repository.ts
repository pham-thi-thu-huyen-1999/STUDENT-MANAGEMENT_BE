import { Injectable } from '@nestjs/common';
import UserRoleEntity from 'src/entities/userRole.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class UserRoleRepository extends Repository<UserRoleEntity> {
  constructor(private dataSource: DataSource) {
    super(UserRoleEntity, dataSource.createEntityManager());
  }
}

export default UserRoleRepository;
