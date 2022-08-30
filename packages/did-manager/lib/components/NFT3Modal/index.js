"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./style.css");
const webNFT3_1 = require("../../hooks/webNFT3");
function NFT3Modal({ title, visible, onClose, children }) {
    const { theme } = (0, webNFT3_1.useNFT3)();
    const className = () => {
        let name = 'nft3-modal';
        if (theme === 'dark')
            name += ' nft3-modal__dark';
        if (visible === true)
            name += ' nft3-modal__visible';
        return name;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: className(), children: [(0, jsx_runtime_1.jsx)("div", { className: "nft3-modal__mask", onClick: onClose }), (0, jsx_runtime_1.jsxs)("div", { className: "nft3-modal__body", children: [(0, jsx_runtime_1.jsxs)("div", { className: "nft3-modal__header", children: [(0, jsx_runtime_1.jsx)("div", { className: "nft3-modal__title", children: title }), (0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 20 20", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "nft3-modal__close", onClick: onClose, children: [(0, jsx_runtime_1.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), (0, jsx_runtime_1.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "nft3-modal__content", children: children })] })] }));
}
exports.default = NFT3Modal;
