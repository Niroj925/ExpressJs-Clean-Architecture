"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatErrorMessage = exports.toTitleCase = void 0;
// capitalize the first letter of the error message and un camal case the rest of the message
function toTitleCase(inputString) {
    const words = inputString.toLowerCase().split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
    }
    return words.join(' ');
}
exports.toTitleCase = toTitleCase;
const formatErrorMessage = (message) => {
    const [firstWord, ...rest] = message.split(' ');
    const words = firstWord.split(/(?=[A-Z])/);
    return `${words.map((w) => toTitleCase(w)).join(' ')} ${rest.join(' ')}`;
};
exports.formatErrorMessage = formatErrorMessage;
exports.default = {
    formatErrorMessage: exports.formatErrorMessage,
};
