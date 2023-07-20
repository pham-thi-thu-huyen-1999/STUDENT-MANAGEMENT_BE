import type { IUserDetail } from './user.interface';

interface IArticle {
  id: number;
  label: string;
  content: string;
  user: IUserDetail;
}

export type { IArticle };
