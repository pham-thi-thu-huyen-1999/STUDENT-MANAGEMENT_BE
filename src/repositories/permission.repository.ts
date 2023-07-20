import { Injectable } from '@nestjs/common';
import PermissionEntity from 'src/entities/permission.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class PermissionRepository extends Repository<PermissionEntity> {
  constructor(private dataSource: DataSource) {
    super(PermissionEntity, dataSource.createEntityManager());
  }
}

export default PermissionRepository;
