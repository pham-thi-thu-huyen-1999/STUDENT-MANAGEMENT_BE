import { HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateMenuUserDto, UpdateMenuUserDto } from 'src/dto/menuUser.dto';
import MenuUserEntity from 'src/entities/menuUser';
import MenuUserMenuResourceEntity from 'src/entities/menuUserMenuResource';
import MenuResourceEntity from 'src/entities/menuResource.entity';
import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IMenuUser } from 'src/interfaces/menuUser.interface';
import MenuUserRepository from 'src/repositories/menuUser.repository';
import menuUserMenuResourceRepository from 'src/repositories/menuUserMenuResource.repository';
import MenuResourceRepository from 'src/repositories/menuResource.repository';
import { buildError, buildMessageErrors } from 'src/utils/functions/builds';
import { handleTotalPage } from 'src/utils/functions/handle';

@Injectable()
class MenuUserService {
  constructor(
    private readonly menuUserRepository: MenuUserRepository,
    private readonly menuResourceRepository: MenuResourceRepository,
    private readonly menuUserMenuResourceRepository: menuUserMenuResourceRepository,
  ) {}

  async getAll(params: IPaginationParams): Promise<IPaginationResponse<IMenuUser[]>> {
    const { pageCurrent, pageSize } = params;

    const start = Number(pageCurrent) - 1;
    const end = Number(pageSize);

    const menuUserData = await this.menuUserRepository.find();

    const menuUsers: IMenuUser[] = menuUserData
      .slice(start * end, start * end + end)
      .map(({ id, name }) => ({ id, name, menuResources: [] }));

    for await (const menuUser of menuUsers) {
      const permissionResources = await this.menuUserMenuResourceRepository.find({
        where: { menuUserId: menuUser.id },
      });
      for await (const { menuResourceId } of permissionResources) {
        const resource = await this.menuResourceRepository.findOne({ where: { id: menuResourceId } });
        menuUser.menuResources.push(resource);
      }
    }

    return {
      list: menuUsers,
      paging: {
        pageCurrent: start + 1,
        pageSize: end,
        totalPage: handleTotalPage(menuUserData.length, end),
        totalSize: menuUserData.length,
      },
    };
  }

  async findOneById(id: number): Promise<IMenuUser> {
    const menuUserData = await this.menuUserRepository.findOneBy({ id });
    menuUserData.menuResources = [];
    const menuUserMenuResourceData = await this.menuUserMenuResourceRepository.find({ where: { menuUserId: id } });

    for await (const { menuResourceId } of menuUserMenuResourceData) {
      const menuResourceData = await this.menuResourceRepository.findOne({ where: { id: menuResourceId } });
      menuUserData.menuResources.push(menuResourceData);
    }
    return menuUserData;
  }

  async create(dto: CreateMenuUserDto): Promise<IMenuUser> {
    //check data
    const menuUserData = await this.menuUserRepository.findOne({ where: { name: dto.name } });
    if (menuUserData) {
      return buildError({ errors: [{ id: 'Name already exists !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    //end

    //check id resources
    const menuResources: MenuResourceEntity[] = [];
    const errors: string[] = [];
    for await (const id of dto.menuUserIds) {
      const menuResourceData = await this.menuResourceRepository.findOne({ where: { id } });
      if (menuResourceData) {
        menuResources.push(menuResourceData);
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

    const newMenuResource = new MenuResourceEntity();
    newMenuResource.name = dto.name;

    //validate Entity
    const errorsValidate = await validate(newMenuResource);
    if (errorsValidate.length > 0) {
      return buildError({
        errors: buildMessageErrors(errorsValidate),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    const menuUserResourceSave = await this.menuUserRepository.save(newMenuResource);
    for (const { id } of menuResources) {
      const newMenuUserMenuResource = new MenuUserMenuResourceEntity();
      newMenuUserMenuResource.menuUserId = menuUserResourceSave.id;
      newMenuUserMenuResource.menuResourceId = id;
      await this.menuUserMenuResourceRepository.save(newMenuUserMenuResource);
    }

    return {
      id: menuUserResourceSave.id,
      name: menuUserResourceSave.name,
      menuResources,
    };
  }

  async update(id: number, dto: UpdateMenuUserDto): Promise<IMenuUser> {
    //check data
    const menuUserData = await this.menuUserRepository.findOne({ where: { id } });
    if (!menuUserData) {
      return buildError({
        errors: [{ id: 'Id is not exist' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    //check id resources
    const menuResources: MenuResourceEntity[] = [];
    const errors: string[] = [];
    for await (const id of dto.menuUserIds) {
      const menuResourceData = await this.menuResourceRepository.findOne({ where: { id } });
      if (menuResourceData) {
        menuResources.push(menuResourceData);
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
    const updateMenuUser = new MenuUserEntity(menuUserData);
    updateMenuUser.name = dto.name;
    // updatePermission.resources = resources;
    const errorsValidate = await validate(updateMenuUser);
    if (errorsValidate.length > 0) {
      return buildError({
        errors: buildMessageErrors(errorsValidate),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    await this.menuUserMenuResourceRepository.delete({ menuUserId: id });
    for (const { id } of menuResources) {
      const newMenuUserMenuResource = new MenuUserMenuResourceEntity();
      newMenuUserMenuResource.menuUserId = updateMenuUser.id;
      newMenuUserMenuResource.menuResourceId = id;
      await this.menuUserMenuResourceRepository.save(newMenuUserMenuResource);
    }
    const menuUserUpdate = await this.menuUserRepository.update({ id }, updateMenuUser);
    if (menuUserUpdate.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot update !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return {
      id: updateMenuUser.id,
      name: updateMenuUser.name,
      menuResources,
    };
  }

  async delete(id: number): Promise<IMenuUser> {
    const menuUserData = await this.menuUserRepository.findOne({ where: { id } });
    if (!menuUserData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    const menuUserDelete = await this.menuUserRepository.delete({ id });
    if (menuUserDelete.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot delete !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return menuUserData;
  }
}

export default MenuUserService;
