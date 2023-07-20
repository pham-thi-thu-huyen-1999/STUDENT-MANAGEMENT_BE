import { HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateResourceDto, UpdateResourceDto } from 'src/dto/resource.dto';
import ResourceEntity from 'src/entities/resource.entity';
import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IResource } from 'src/interfaces/resources.interface';
import ResourceRepository from 'src/repositories/resource.repository';
import { buildMessageErrors, buildError, buildValidPagination } from 'src/utils/functions/builds';
import { handleTotalPage } from 'src/utils/functions/handle';

@Injectable()
class ResourceService {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  async getAll(params: IPaginationParams): Promise<IPaginationResponse<IResource[]>> {
    const { pageCurrent, pageSize } = params;

    const start = Number(pageCurrent) - 1;
    const end = Number(pageSize);

    buildValidPagination(params);

    const resourceData = await this.resourceRepository.find();
    const list = resourceData.slice(start * end, start * end + end);

    return {
      list,
      paging: {
        pageCurrent: start + 1,
        pageSize: end,
        totalPage: handleTotalPage(resourceData.length, end),
        totalSize: resourceData.length,
      },
    };
  }

  async findOneById(id: number): Promise<IResource> {
    return this.resourceRepository.findOneBy({ id });
  }

  async create(dto: CreateResourceDto): Promise<IResource> {
    const resourceData = await this.resourceRepository.findOne({ where: { name: dto.name, value: dto.value } });
    if (resourceData) {
      return buildError({
        errors: [
          {
            Name: 'Name was duplicated !',
            Value: 'Value was duplicated !',
          },
        ],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const newResource = new ResourceEntity();
    newResource.name = dto.name;
    newResource.value = dto.value;
    const errors = await validate(newResource);

    if (errors.length > 0) {
      return buildError({
        errors: buildMessageErrors(errors),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.resourceRepository.save(newResource);
  }

  async update(id: number, dto: UpdateResourceDto): Promise<IResource> {
    const resourceData = await this.resourceRepository.findOne({ where: { id } });
    if (!resourceData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }

    const updateResource = new ResourceEntity(resourceData);
    updateResource.name = dto.name;
    updateResource.value = dto.value;

    const dataUpdate = await this.resourceRepository.update({ id }, updateResource);
    if (dataUpdate.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot update !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return updateResource;
  }

  async delete(id: number): Promise<IResource> {
    const resourceData = await this.resourceRepository.findOne({ where: { id } });
    if (!resourceData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    const resourceDelete = await this.resourceRepository.delete({ id });
    if (resourceDelete.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot delete !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return resourceData;
  }
}

export default ResourceService;
