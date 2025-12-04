import { IPaginationQuery } from './interface/pagination.options.interface';
import { IPaginationData } from './interface/response-data.interface';

export class AppPagination<T> {
  public statusCode: number;
  public message: string;
  public data: T[];
  public meta: {
    limit: number;
    total: number;
    page_total: number;
    total_pages: number;
    page: number;
    previous?: string;
    next?: string;
  };

  constructor(paginationResults: IPaginationData & IPaginationQuery & { statusCode?: number; message?: string }) {
    this.statusCode = paginationResults.statusCode ?? 200;
    this.message = paginationResults.message ?? 'success';
    this.data = paginationResults.data;

    const page = Number(paginationResults.page ?? 1);
    const limit = Number(paginationResults.limit ?? 10);
    const totalPages = Math.ceil(paginationResults.total / limit);

    this.meta = {
      limit,
      total: paginationResults.total,
      page_total: paginationResults.data.length,
      total_pages: totalPages,
      page,
      previous: page > 1 ? String(page - 1) : undefined,
      next: page < totalPages ? String(page + 1) : undefined,
    };
  }
}
