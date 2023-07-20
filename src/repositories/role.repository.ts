import { Injectable } from '@nestjs/common';
import RoleEntity from 'src/entities/role.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class RoleRepository extends Repository<RoleEntity> {
  constructor(private dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }
}

export default RoleRepository;
