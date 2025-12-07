
import { IPaginationQuery } from '../../common/interface/response/interface/pagination.options.interface';
import { AppPagination } from '../../common/interface/response/app-pagination';
import { AppResponse } from '../../common/interface/response/app-response';
import { IPaginationData } from '../../common/interface/response/interface/response-data.interface';

export abstract class CoreApiResponse {
  static success<TData>(
    data: TData,
    statusCode: number = 200,
    message: string = 'success',
  ) {
    return new AppResponse({
      data: data,
      statusCode,
      message,
    });
  }

static error(
  statusCode: number = 400,
  message: string = 'Error',
  error?: any 
) {
  return new AppResponse({
    statusCode,
    message,
    error,
    data: {},
  });
}

  static pagination(
    paginationData: IPaginationData,
    query: IPaginationQuery,
    statusCode: number = 200,
    message: string = 'success',
  ) {
    return new AppPagination({
      ...paginationData,
      ...query,
      statusCode,
      message: message,
    });
  }
}


