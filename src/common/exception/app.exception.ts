import { IError } from '../type/iError';
import { BaseException } from './base.exception';
import { ValidationError } from 'class-validator';

export default class AppException extends BaseException {
  constructor(
    appErrors: IError | string = {},
    message: string = 'Invalid data',
    statusCode: number = 400
  ) {
    if (typeof appErrors === 'string') {
      // Convert string error to ValidationError[] format
      super([], appErrors, statusCode);
      return;
    }

    // Convert IError to ValidationError[] format
    const errors: ValidationError[] = Object.keys(appErrors).map((key) => ({
      target: {},
      property: key,
      constraints: { key: appErrors[key] },
      children: [],
      value: key,
    }));

    super(errors, message, statusCode);
  }
}
