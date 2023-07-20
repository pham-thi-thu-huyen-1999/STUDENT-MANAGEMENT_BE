import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PermissionController from 'src/controllers/permission.controller';
import PermissionRepository from 'src/repositories/permission.repository';
import PermissionResourceRepository from 'src/repositories/permissionResource.repository';
import ResourceRepository from 'src/repositories/resource.repository';
import PermissionService from 'src/services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository, ResourceRepository, PermissionResourceRepository])],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionResourceRepository, PermissionRepository, ResourceRepository],
  exports: [PermissionService],
})
class PermissionModule {}

export default PermissionModule;
