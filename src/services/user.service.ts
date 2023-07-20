import { HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { UpdateUserDto } from 'src/dto/user.dto';
import MenuUserEntity from 'src/entities/menuUser';
import RoleEntity from 'src/entities/role.entity';
import UserEntity from 'src/entities/user.entity';
import UserMenuUserEntity from 'src/entities/userMenuUser.entity';
import UserRoleEntity from 'src/entities/userRole.entity';
import { IPaginationParams, IPaginationResponse } from 'src/interfaces/global.interface';
import { IUser } from 'src/interfaces/user.interface';
import MenuUserRepository from 'src/repositories/menuUser.repository';
import RoleRepository from 'src/repositories/role.repository';
import UserRepository from 'src/repositories/user.repository';
import UserMenuUserRepository from 'src/repositories/userMenuUser.repository';
import UserRoleRepository from 'src/repositories/userRole.repository';
import { buildError, buildMessageErrors } from 'src/utils/functions/builds';
import { handleTotalPage } from 'src/utils/functions/handle';

@Injectable()
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly menuUserRepository: MenuUserRepository,
    private readonly userMenuUserRepository: UserMenuUserRepository,
  ) {}

  async getAll(params: IPaginationParams): Promise<IPaginationResponse<IUser[]>> {
    const { pageCurrent, pageSize } = params;
    const start = Number(pageCurrent) - 1;
    const end = Number(pageSize);

    const userData = await this.userRepository.find();

    const users: IUser[] = userData
      .slice(start * end, start * end + end)
      .map(({ id, firstName, lastName, email, avatar }) => ({
        id,
        firstName,
        lastName,
        email,
        avatar,
        roles: [],
        menuUser: null,
      }));

    for await (const user of users) {
      const userRoleData = await this.userRoleRepository.find({ where: { userId: user.id } });
      const userMenuUserData = await this.userMenuUserRepository.findOne({ where: { userId: user.id } });
      if (userMenuUserData) {
        const menuUser = await this.menuUserRepository.findOne({ where: { id: userMenuUserData.menuUserId } });
        user.menuUser = menuUser;
      } else {
        user.menuUser = null;
      }

      for await (const { roleId } of userRoleData) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        user.roles.push(role);
      }
    }

    return {
      list: users,
      paging: {
        pageCurrent: start + 1,
        pageSize: end,
        totalPage: handleTotalPage(userData.length, end),
        totalSize: userData.length,
      },
    };
  }

  async findOneById(id: number): Promise<IUser> {
    const userData = await this.userRepository.findOneBy({ id });
    userData.roles = [];
    const userRoleData = await this.userRoleRepository.find({ where: { userId: id } });

    let i = 0;
    for await (const { roleId } of userRoleData) {
      const roleData = await this.roleRepository.findOne({ where: { id: roleId } });
      userData.roles.push(roleData);
    }
    return userData;
  }

  async findByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<IUser> {
    //check id user
    const userData = await this.userRepository.findOne({ where: { id } });
    if (!userData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    //end

    //check id roles
    const roles: RoleEntity[] = [];
    const errors: string[] = [];

    if (dto.roleIds) {
      for await (const id of dto.roleIds) {
        const roleData = await this.roleRepository.findOne({ where: { id } });
        if (roleData) {
          roles.push(roleData);
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
    }
    //end

    //check id menu user
    let menuUser: MenuUserEntity;

    if (dto.menuUserId) {
      const menuUserData = await this.menuUserRepository.findOne({ where: { id: dto.menuUserId } });
      if (menuUserData) {
        menuUser = menuUserData;
      } else {
        return buildError({
          errors: [{ menuUserId: 'Id is not exist !' }],
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    }
    //end

    //validate Entity
    const updateUser = new UserEntity(userData);
    updateUser.email = userData.email;
    updateUser.firstName = dto.firstName;
    updateUser.lastName = dto.lastName;
    updateUser.avatar = dto.avatar;
    updateUser.menuUser = menuUser;
    // updatePermission.resources = resources;

    const errorsValidate = await validate(updateUser);
    if (errorsValidate.length > 0) {
      return buildError({
        errors: buildMessageErrors(errorsValidate),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    //end

    if (dto.roleIds) {
      await this.userRoleRepository.delete({ userId: id });

      for (const { id } of roles) {
        const newUserRole = new UserRoleEntity();
        newUserRole.userId = updateUser.id;
        newUserRole.roleId = id;
        await this.userRoleRepository.save(newUserRole);
      }
    }

    if (dto.menuUserId) {
      await this.userMenuUserRepository.delete({ userId: id });

      const newUserMenuUser = new UserMenuUserEntity();
      newUserMenuUser.userId = userData.id;
      newUserMenuUser.menuUserId = menuUser.id;

      this.userMenuUserRepository.save(newUserMenuUser);
    }

    const userUpdate = await this.userRepository.update({ id }, updateUser);
    if (userUpdate.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot update !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }

    return {
      id: updateUser.id,
      email: updateUser.email,
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      avatar: updateUser.avatar,
      roles,
      menuUser,
    };
  }

  async delete(id: number): Promise<IUser> {
    const userData = await this.userRepository.findOne({ where: { id } });
    if (!userData) {
      return buildError({ errors: [{ id: 'Id is not exist !' }], statusCode: HttpStatus.BAD_REQUEST });
    }
    const userDelete = await this.userRepository.delete({ id });
    if (userDelete.raw === 0) {
      return buildError({ errors: [{ id: 'Cannot delete !' }], statusCode: HttpStatus.EXPECTATION_FAILED });
    }
    return userData;
  }
}

export default UserService;
