import { HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateMenuResourceDto, UpdateMenuResourceDto } from 'src/dto/menuResource.dto';
import MenuResourceEntity from 'src/entities/menuResource.entity';

import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IMenuResource } from 'src/interfaces/menuResource.interface';
import MenuResourceRepository from 'src/repositories/menuResource.repository';

import { buildMessageErrors, buildError, buildValidPagination } from 'src/utils/functions/builds';
import { handleTotalPage } from 'src/utils/functions/handle';

@Injectable()
class MenuResourceService {
  constructor(private readonly menuResourceRepository: MenuResourceRepository) {}

  async getAll(params: IPaginationParams): Promise<IPaginationResponse<IMenuResource[]>> {
    const { pageCurrent, pageSize } = params;

    const start = Number(pageCurrent) - 1;
    const end = Number(pageSize);

    buildValidPagination(params);

    const resourceData = await this.menuResourceRepository.find();
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

  async findOneById(id: number): Promise<IMenuResource> {
    return this.menuResourceRepository.findOneBy({ id });
  }

  async create(dto: CreateMenuResourceDto): Promise<IMenuResource> {
    const { iconName, iconType, name, path } = dto;
    const menuResourceData = await this.menuResourceRepository.findOne({ where: { path } });

    if (menuResourceData) {
      return buildError({
        errors: [
          {
            Path: 'Path was duplicated !',
          },
        ],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const newMenuResource = new MenuResourceEntity();
    newMenuResource.name = dto.name;
    newMenuResource.iconType = dto.iconType;
    newMenuResource.iconName = dto.iconName;
    newMenuResource.path = dto.path;

    const errors = await validate(newMenuResource);

    if (errors.length > 0) {
      return buildError({
        errors: buildMessageErrors(errors),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.menuResourceRepository.save(newMenuResource);
  }

  async update(id: number, dto: UpdateMenuResourceDto): Promise<IMenuResource> {
    const resourceData = await this.menuResourceRepository.findOne({ where: { id } });
    if (!resourceData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }

    const updateMenuResource = new MenuResourceEntity(resourceData);
    updateMenuResource.name = dto.name;
    updateMenuResource.iconType = dto.iconType;
    updateMenuResource.iconName = dto.iconName;
    updateMenuResource.path = dto.path;

    const dataUpdate = await this.menuResourceRepository.update({ id }, updateMenuResource);
    if (dataUpdate.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot update !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return updateMenuResource;
  }

  async delete(id: number): Promise<IMenuResource> {
    const resourceData = await this.menuResourceRepository.findOne({ where: { id } });
    if (!resourceData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    const resourceDelete = await this.menuResourceRepository.delete({ id });
    if (resourceDelete.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot update !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return resourceData;
  }
}

export default MenuResourceService;
