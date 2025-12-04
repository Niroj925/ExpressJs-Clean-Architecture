"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = void 0;
function generateRandomPassword(length = 8) {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const allChars = letters + numbers;
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
        password += randomChar;
    }
    return password;
}
exports.generateRandomPassword = generateRandomPassword;
