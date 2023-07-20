import { Injectable } from '@nestjs/common';
import RolePermissionEntity from 'src/entities/rolePermission.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class RolePermissionRepository extends Repository<RolePermissionEntity> {
  constructor(private dataSource: DataSource) {
    super(RolePermissionEntity, dataSource.createEntityManager());
  }
}

export default RolePermissionRepository;
