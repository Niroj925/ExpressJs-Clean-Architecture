"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPagination = void 0;
class AppPagination {
    constructor(paginationResults) {
        var _a, _b, _c, _d;
        this.statusCode = (_a = paginationResults.statusCode) !== null && _a !== void 0 ? _a : 200;
        this.message = (_b = paginationResults.message) !== null && _b !== void 0 ? _b : 'success';
        this.data = paginationResults.data;
        const page = Number((_c = paginationResults.page) !== null && _c !== void 0 ? _c : 1);
        const limit = Number((_d = paginationResults.limit) !== null && _d !== void 0 ? _d : 10);
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
exports.AppPagination = AppPagination;
