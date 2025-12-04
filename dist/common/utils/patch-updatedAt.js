"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchUpdatedAt = void 0;
function patchUpdatedAt(item) {
    return Object.assign(Object.assign({}, item), { updatedAt: new Date() });
}
exports.patchUpdatedAt = patchUpdatedAt;
