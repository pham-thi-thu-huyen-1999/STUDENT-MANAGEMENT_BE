import { IPermission } from './permissions.interface';

interface IRole {
  id: number;
  name: string;
  permissions: IPermission[];
}

export type { IRole };
