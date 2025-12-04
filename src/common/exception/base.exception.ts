
import { ValidationError } from 'class-validator';
import { ResponseDto } from 'common/type/response';
import { formatErrorMessage } from 'common/utils/errorFormater.utils';

// const reduceErrors = (errors: ValidationError[]): object => {
//   return errors?.reduce((obj, item) => {
//     if (item.children?.length > 0) {
//       obj[item.property] = reduceErrors(item.children);
//     } else {
//       obj[item.property] = formatErrorMessage(
//         Array.isArray(Object.values(item.constraints))
//           ? Object.values(item.constraints)[0]
//           : Object.values(item.constraints).toString(),
//       );
//     }
//     return obj;
//   }, {});
// };

const reduceErrors = (errors: ValidationError[]): object => {
  return errors?.reduce((obj: any, item) => {
    if (item.children?.length) {
      obj[item.property] = reduceErrors(item.children);
    } else if (item.constraints) {
      const constraints = Object.values(item.constraints);
      obj[item.property] = formatErrorMessage(
        Array.isArray(constraints) ? constraints[0] : String(constraints),
      );
    }

    return obj;
  }, {});
};


export { reduceErrors as reduceErrors };

// export class BaseException  {
//   constructor(
//     private readonly errors: ValidationError[],
//     message: string = 'Validation failed',
//     statusCode: number = 400,
//   ) {
//     const errorsMessages = reduceErrors(errors);
//     const responseDto: ResponseDto = {
//       statusCode,
//       timestamp: new Date().toISOString(),
//       message: message,
//       error: errorsMessages,
//       data: {},
//     };
//     super(responseDto, statusCode);
//   }
// }

export class BaseException extends Error {
  public readonly statusCode: number;
  public readonly response: ResponseDto;

  constructor(
    errors: ValidationError[],
    message: string = 'Validation failed',
    statusCode: number = 400,
  ) {
    super(message);

    const errorsMessages = reduceErrors(errors);

    this.statusCode = statusCode;

    this.response = {
      statusCode,
      timestamp: new Date().toISOString(),
      message: message,
      error: errorsMessages,
      data: {},
    };
  }
}

