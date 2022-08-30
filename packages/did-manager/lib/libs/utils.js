"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortAddr = exports.utf82hex = void 0;
function utf82hex(text) {
    const buf = new TextEncoder().encode(text);
    let result = '';
    for (let i = 0; i < buf.length; i++) {
        const item = buf[i].toString(16).padStart(2, '0');
        result += item;
    }
    return result;
}
exports.utf82hex = utf82hex;
function shortAddr(account, length = 4) {
    const isHex = account.startsWith('0x');
    return `${account.slice(0, isHex ? length + 2 : length)}...${account.slice(-length)}`;
}
exports.shortAddr = shortAddr;
