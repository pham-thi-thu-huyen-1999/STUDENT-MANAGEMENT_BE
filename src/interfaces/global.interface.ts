interface IPagination {
  pageCurrent: number;
  pageSize: number;
  totalPage: number;
  totalSize: number;
}

interface IPaginationParams {
  pageCurrent?: number | string;
  pageSize?: number | string;
}

interface IPaginationResponse<T> {
  list: T;
  paging: IPagination;
}

export { IPagination, IPaginationParams, IPaginationResponse };
