import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MenuUserController from 'src/controllers/menuUser.controller';
import MenuResourceRepository from 'src/repositories/menuResource.repository';
import MenuUserRepository from 'src/repositories/menuUser.repository';
import MenuUserMenuResourceRepository from 'src/repositories/menuUserMenuResource.repository';
import MenuUserService from 'src/services/menuUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuUserRepository, MenuResourceRepository, MenuUserMenuResourceRepository])],
  controllers: [MenuUserController],
  providers: [MenuUserService, MenuUserRepository, MenuResourceRepository, MenuUserMenuResourceRepository],
  exports: [MenuUserService],
})
class MenuUserModule {}

export default MenuUserModule;
