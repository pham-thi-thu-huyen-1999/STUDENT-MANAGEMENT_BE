import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import RoleController from 'src/controllers/role.controller';
import PermissionRepository from 'src/repositories/permission.repository';
import RoleRepository from 'src/repositories/role.repository';
import RolePermissionRepository from 'src/repositories/rolePermission.repository';
import RoleService from 'src/services/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository, PermissionRepository, RolePermissionRepository])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, PermissionRepository, RolePermissionRepository],
  exports: [RoleService],
})
class RoleModule {}

export default RoleModule;
