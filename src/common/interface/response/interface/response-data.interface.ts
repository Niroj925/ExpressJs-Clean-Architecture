export interface IPaginationData {
  data: Array<any>;
  warnings?: any;
  total: number;
  limit: number;
  page: number;
  previous?: string | null | undefined;
  next?: string | null | undefined;
}
