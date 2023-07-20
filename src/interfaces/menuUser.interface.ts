import type { IMenuResource } from './menuResource.interface';

interface IMenuUser {
  id: number;
  name: string;
  menuResources: IMenuResource[];
}

export type { IMenuUser };
