import { HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreatePermissionDto, UpdatePermissionDto } from 'src/dto/permission.dto';
import PermissionEntity from 'src/entities/permission.entity';
import PermissionResourceEntity from 'src/entities/permissionResource.entity';
import ResourceEntity from 'src/entities/resource.entity';
import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IPermission } from 'src/interfaces/permissions.interface';
import PermissionRepository from 'src/repositories/permission.repository';
import PermissionResourceRepository from 'src/repositories/permissionResource.repository';
import ResourceRepository from 'src/repositories/resource.repository';
import { buildError, buildMessageErrors } from 'src/utils/functions/builds';
import { handleTotalPage } from 'src/utils/functions/handle';

@Injectable()
class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly resourceRepository: ResourceRepository,
    private readonly permissionResourceRepository: PermissionResourceRepository,
  ) {}

  async getAll(params: IPaginationParams): Promise<IPaginationResponse<IPermission[]>> {
    const { pageCurrent, pageSize } = params;

    const start = Number(pageCurrent) - 1;
    const end = Number(pageSize);

    const permissionData = await this.permissionRepository.find();

    const permissions: IPermission[] = permissionData
      .slice(start * end, start * end + end)
      .map(({ id, name }) => ({ id, name, resources: [] }));

    for await (const permission of permissions) {
      const permissionResources = await this.permissionResourceRepository.find({
        where: { permissionId: permission.id },
      });
      for await (const { resourceId } of permissionResources) {
        const resource = await this.resourceRepository.findOne({ where: { id: resourceId } });
        permission.resources.push(resource);
      }
    }

    return {
      list: permissions,
      paging: {
        pageCurrent: start + 1,
        pageSize: end,
        totalPage: handleTotalPage(permissionData.length, end),
        totalSize: permissionData.length,
      },
    };
  }

  async findOneById(id: number): Promise<IPermission> {
    const permissionData = await this.permissionRepository.findOneBy({ id });
    permissionData.resources = [];
    const permissionResourceData = await this.permissionResourceRepository.find({ where: { permissionId: id } });

    let i = 0;
    for await (const { resourceId } of permissionResourceData) {
      const resourceData = await this.resourceRepository.findOne({ where: { id: resourceId } });
      permissionData.resources.push(resourceData);
    }
    return permissionData;
  }

  async create(dto: CreatePermissionDto): Promise<IPermission> {
    //check data
    const permissionData = await this.permissionRepository.findOne({ where: { name: dto.name } });
    if (permissionData) {
      return buildError({ errors: [{ id: 'Name already exists !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    //end

    //check id resources
    const resources: ResourceEntity[] = [];
    const errors: string[] = [];

    for await (const id of dto.resourceIds) {
      const resourceData = await this.resourceRepository.findOne({ where: { id } });
      if (resourceData) {
        resources.push(resourceData);
      } else {
        errors.push(`Id ${id} is not exist`);
      }
    }

    if (errors.length > 0) {
      return buildError({
        errors: errors.map((error) => ({ id: error })),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    const newPermission = new PermissionEntity();
    newPermission.name = dto.name;
    // newPermission.resources = resources;

    //validate Entity
    const errorsValidate = await validate(newPermission);
    if (errorsValidate.length > 0) {
      return buildError({
        errors: buildMessageErrors(errorsValidate),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    const permissionSave = await this.permissionRepository.save(newPermission);

    for (const { id } of resources) {
      const newPermissionResource = new PermissionResourceEntity();
      newPermissionResource.permissionId = permissionSave.id;
      newPermissionResource.resourceId = id;
      await this.permissionResourceRepository.save(newPermissionResource);
    }

    return {
      id: permissionSave.id,
      name: permissionSave.name,
      resources,
    };
  }

  async update(id: number, dto: UpdatePermissionDto): Promise<IPermission> {
    //check data
    const permissionData = await this.permissionRepository.findOne({ where: { id } });
    if (!permissionData) {
      return buildError({
        errors: [{ id: 'Id is not exist' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    //check id resources
    const resources: ResourceEntity[] = [];
    const errors: string[] = [];

    for await (const id of dto.resourceIds) {
      const resourceData = await this.resourceRepository.findOne({ where: { id } });
      if (resourceData) {
        resources.push(resourceData);
      } else {
        errors.push(`Id ${id} is not exist`);
      }
    }

    if (errors.length > 0) {
      return buildError({
        errors: errors.map((error) => ({ id: error })),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    //validate Entity
    const updatePermission = new PermissionEntity(permissionData);
    updatePermission.name = dto.name;
    // updatePermission.resources = resources;

    const errorsValidate = await validate(updatePermission);
    if (errorsValidate.length > 0) {
      return buildError({
        errors: buildMessageErrors(errorsValidate),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    await this.permissionResourceRepository.delete({ permissionId: id });

    for (const { id } of resources) {
      const newPermissionResource = new PermissionResourceEntity();
      newPermissionResource.permissionId = updatePermission.id;
      newPermissionResource.resourceId = id;
      await this.permissionResourceRepository.save(newPermissionResource);
    }

    const permissionUpdate = await this.permissionRepository.update({ id }, updatePermission);
    if (permissionUpdate.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot update !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }

    return {
      id: updatePermission.id,
      name: updatePermission.name,
      resources,
    };
  }

  async delete(id: number): Promise<IPermission> {
    const permissionData = await this.permissionRepository.findOne({ where: { id } });
    if (!permissionData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    const permissionDelete = await this.permissionRepository.delete({ id });
    if (permissionDelete.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot delete !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return permissionData;
  }
}

export default PermissionService;
