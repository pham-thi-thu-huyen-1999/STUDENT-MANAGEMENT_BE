import { IMenuUser } from './menuUser.interface';
import { IRole } from './role.interface';

interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  roles: IRole[];
  menuUser: IMenuUser | null;
}

interface IUserInfo {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  roleIds: number[];
  created: number;
  updated: number;
}

interface IUserEntity {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  password: string;
  created: number;
  updated: number;
}

interface IUserDetail {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export type { IUser, IUserEntity, IUserInfo, IUserDetail };
