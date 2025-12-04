"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeWords = void 0;
function capitalizeWords(input) {
    return input
        .toLowerCase()
        .split(/[_\s]+/) // handles snake_case or space-separated words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
exports.capitalizeWords = capitalizeWords;
