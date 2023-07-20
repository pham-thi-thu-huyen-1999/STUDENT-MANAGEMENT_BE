import { IResource } from './resources.interface';

interface IPermission {
  id: number;
  name: string;
  resources: IResource[];
}

export type { IPermission };
