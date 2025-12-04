"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateArray = void 0;
function paginateArray(items) {
    const page = 1;
    const limit = 10;
    const total = items.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = items.slice(start, end);
    return {
        data,
        total,
        limit,
        page,
        previous: page > 1 ? `${Number(page) - 1}` : null,
        next: page * limit < total ? `${Number(page) + 1}` : null,
    };
}
exports.paginateArray = paginateArray;
