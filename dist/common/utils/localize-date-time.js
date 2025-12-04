"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localizeDate = exports.localizeTime = void 0;
function localizeTime(date) {
    return date.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}
exports.localizeTime = localizeTime;
function localizeDate(date) {
    return date.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kathmandu',
    });
}
exports.localizeDate = localizeDate;
