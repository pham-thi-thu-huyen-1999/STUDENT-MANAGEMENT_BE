import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MenuResourceController from 'src/controllers/menuResource.controller';
import MenuResourceRepository from 'src/repositories/menuResource.repository';
import MenuResourceService from 'src/services/menuResource.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuResourceRepository])],
  controllers: [MenuResourceController],
  providers: [MenuResourceService, MenuResourceRepository],
  exports: [MenuResourceService],
})
class MenuResourceModule {}

export default MenuResourceModule;
