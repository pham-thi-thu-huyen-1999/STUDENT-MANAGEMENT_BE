import { HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateRoleDto, UpdateRoleDto } from 'src/dto/role.dto';
import PermissionEntity from 'src/entities/permission.entity';
import RoleEntity from 'src/entities/role.entity';
import RolePermissionEntity from 'src/entities/rolePermission.entity';
import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IRole } from 'src/interfaces/role.interface';
import PermissionRepository from 'src/repositories/permission.repository';
import RoleRepository from 'src/repositories/role.repository';
import RolePermissionRepository from 'src/repositories/rolePermission.repository';
import { buildError, buildMessageErrors } from 'src/utils/functions/builds';
import { handleTotalPage } from 'src/utils/functions/handle';

@Injectable()
class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async getAll(params: IPaginationParams): Promise<IPaginationResponse<IRole[]>> {
    const { pageCurrent, pageSize } = params;

    const start = Number(pageCurrent) - 1;
    const end = Number(pageSize);

    const roleData = await this.roleRepository.find();

    const roles: IRole[] = roleData
      .slice(start * end, start * end + end)
      .map(({ id, name }) => ({ id, name, permissions: [] }));

    for await (const role of roles) {
      const rolePermissionData = await this.rolePermissionRepository.find({ where: { roleId: role.id } });
      for await (const { permissionId } of rolePermissionData) {
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
        role.permissions.push(permission);
      }
    }

    return {
      list: roles,
      paging: {
        pageCurrent: start + 1,
        pageSize: end,
        totalPage: handleTotalPage(roleData.length, end),
        totalSize: roleData.length,
      },
    };
  }

  async findOneById(id: number): Promise<IRole> {
    const roleData = await this.roleRepository.findOneBy({ id });
    roleData.permissions = [];
    const rolePermissionData = await this.rolePermissionRepository.find({ where: { roleId: id } });

    let i = 0;
    for await (const { permissionId } of rolePermissionData) {
      const permissionData = await this.permissionRepository.findOne({ where: { id: permissionId } });
      roleData.permissions.push(permissionData);
    }
    return roleData;
  }

  async create(dto: CreateRoleDto): Promise<IRole> {
    //check data
    const roleData = await this.roleRepository.findOne({ where: { name: dto.name } });
    if (roleData) {
      return buildError({ errors: [{ id: 'Name already exists !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    //end

    //check id permissions
    const permissions: PermissionEntity[] = [];
    const errors: string[] = [];

    for await (const id of dto.permissionIds) {
      const permissionData = await this.permissionRepository.findOne({ where: { id } });
      if (permissionData) {
        permissions.push(permissionData);
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

    const newRole = new RoleEntity();
    newRole.name = dto.name;
    // newPermission.resources = resources;

    //validate Entity
    const errorsValidate = await validate(newRole);
    if (errorsValidate.length > 0) {
      return buildError({
        errors: buildMessageErrors(errorsValidate),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    const roleSave = await this.roleRepository.save(newRole);

    for (const { id } of permissions) {
      const newRolePermission = new RolePermissionEntity();
      newRolePermission.roleId = roleSave.id;
      newRolePermission.permissionId = id;
      await this.rolePermissionRepository.save(newRolePermission);
    }

    return {
      id: roleSave.id,
      name: roleSave.name,
      permissions: permissions,
    };
  }

  async update(id: number, dto: UpdateRoleDto): Promise<IRole> {
    //check data
    const roleData = await this.roleRepository.findOne({ where: { id } });
    if (!roleData) {
      return buildError({
        errors: [{ id: 'Id is not exist' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    //check id resources
    const permissions: PermissionEntity[] = [];
    const errors: string[] = [];

    for await (const id of dto.permissionIds) {
      const permissionData = await this.permissionRepository.findOne({ where: { id } });
      if (permissionData) {
        permissions.push(permissionData);
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
    //en

    //validate Entity
    const updateRole = new RoleEntity(roleData);
    updateRole.name = dto.name;
    // updatePermission.resources = resources;

    const errorsValidate = await validate(updateRole);
    if (errorsValidate.length > 0) {
      return buildError({
        errors: buildMessageErrors(errorsValidate),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    await this.rolePermissionRepository.delete({ roleId: id });

    for (const { id } of permissions) {
      const newRolePermission = new RolePermissionEntity();
      newRolePermission.roleId = updateRole.id;
      newRolePermission.permissionId = id;
      await this.rolePermissionRepository.save(newRolePermission);
    }

    const roleUpdate = await this.roleRepository.update({ id }, updateRole);
    if (roleUpdate.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot update !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }

    return {
      id: updateRole.id,
      name: updateRole.name,
      permissions,
    };
  }

  async delete(id: number): Promise<IRole> {
    const roleData = await this.roleRepository.findOne({ where: { id } });
    if (!roleData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    const roleDelete = await this.roleRepository.delete({ id });
    if (roleDelete.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot delete !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return roleData;
  }
}

export default RoleService;
