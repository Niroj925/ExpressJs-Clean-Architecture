"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = exports.reduceErrors = void 0;
const errorFormater_utils_1 = require("common/utils/errorFormater.utils");
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
const reduceErrors = (errors) => {
    return errors === null || errors === void 0 ? void 0 : errors.reduce((obj, item) => {
        var _a;
        if ((_a = item.children) === null || _a === void 0 ? void 0 : _a.length) {
            obj[item.property] = reduceErrors(item.children);
        }
        else if (item.constraints) {
            const constraints = Object.values(item.constraints);
            obj[item.property] = (0, errorFormater_utils_1.formatErrorMessage)(Array.isArray(constraints) ? constraints[0] : String(constraints));
        }
        return obj;
    }, {});
};
exports.reduceErrors = reduceErrors;
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
class BaseException extends Error {
    constructor(errors, message = 'Validation failed', statusCode = 400) {
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
exports.BaseException = BaseException;
