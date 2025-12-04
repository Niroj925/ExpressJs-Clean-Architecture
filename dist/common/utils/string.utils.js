"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get24hTime = exports.camelToPascalCase = exports.unslugify = exports.slugify = void 0;
function slugify(str) {
    return str
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
exports.slugify = slugify;
function unslugify(slug) {
    const str = slug.replace(/_/g, ' ');
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
exports.unslugify = unslugify;
function camelToPascalCase(str) {
    // Use regex to capitalize the first character of the string
    return str.replace(/^[a-z]/, (match) => match.toUpperCase());
}
exports.camelToPascalCase = camelToPascalCase;
function get24hTime(dateString) {
    const date = new Date(dateString);
    // Get the 24-hour time format
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // Format the time with leading zeros if necessary
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
exports.get24hTime = get24hTime;
