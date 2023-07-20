import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DataSource } from 'typeorm';
import UserEntity from './entities/user.entity';
import UsersModule from './modules/users.module';
import AuthModule from './modules/auth.module';
import ResourceEntity from './entities/resource.entity';
import PermissionEntity from './entities/permission.entity';
import RoleEntity from './entities/role.entity';
import ResourceModule from './modules/resource.module';
import PermissionModule from './modules/permission.module';
import RoleModule from './modules/role.module';
import PermissionResourceEntity from './entities/permissionResource.entity';
import RolePermissionEntity from './entities/rolePermission.entity';
import UserRoleEntity from './entities/userRole.entity';
import ArticleEntity from './entities/article.entity';
import ArticleModule from './modules/article.module';
import MenuUserEntity from './entities/menuUser';
import MenuResourceEntity from './entities/menuResource.entity';
import MenuUserMenuResourceEntity from './entities/menuUserMenuResource';
import MenuUserModule from './modules/menuUser.module';
import MenuResourceModule from './modules/menuResource.module';
import UserMenuUserEntity from './entities/userMenuUser.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      // url: 'mysql:http://192.168.1.2:3306',
      port: 3306,
      username: 'root',
      password: 'root@123456',
      database: 'test_1',
      entities: [
        UserEntity,
        RoleEntity,
        PermissionEntity,
        ResourceEntity,
        UserRoleEntity,
        RolePermissionEntity,
        PermissionResourceEntity,
        ArticleEntity,
        MenuUserEntity,
        MenuResourceEntity,
        MenuUserMenuResourceEntity,
        UserMenuUserEntity,
      ],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    ResourceModule,
    PermissionModule,
    RoleModule,
    ArticleModule,
    MenuUserModule,
    MenuResourceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
