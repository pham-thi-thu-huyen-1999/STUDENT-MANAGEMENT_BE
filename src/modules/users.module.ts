import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserController from 'src/controllers/user.controller';
import MenuUserRepository from 'src/repositories/menuUser.repository';
import RoleRepository from 'src/repositories/role.repository';
import UserRepository from 'src/repositories/user.repository';
import UserMenuUserRepository from 'src/repositories/userMenuUser.repository';
import UserRoleRepository from 'src/repositories/userRole.repository';
import UserService from 'src/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      RoleRepository,
      UserRoleRepository,
      MenuUserRepository,
      UserMenuUserRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleRepository,
    UserRoleRepository,
    MenuUserRepository,
    UserMenuUserRepository,
  ],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
