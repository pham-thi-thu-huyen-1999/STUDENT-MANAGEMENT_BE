import { Injectable } from '@nestjs/common';
import UserEntity from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
}

export default UserRepository;
