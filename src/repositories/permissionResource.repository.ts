import { Injectable } from '@nestjs/common';
import PermissionResourceEntity from 'src/entities/permissionResource.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
class PermissionResourceRepository extends Repository<PermissionResourceEntity> {
  constructor(private dataSource: DataSource) {
    super(PermissionResourceEntity, dataSource.createEntityManager());
  }
}

export default PermissionResourceRepository;
