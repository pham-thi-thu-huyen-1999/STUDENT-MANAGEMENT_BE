import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ResourceController from 'src/controllers/resource.controller';
import ResourceRepository from 'src/repositories/resource.repository';
import ResourceService from 'src/services/resource.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceRepository])],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository],
  exports: [ResourceService],
})
class ResourceModule {}

export default ResourceModule;
