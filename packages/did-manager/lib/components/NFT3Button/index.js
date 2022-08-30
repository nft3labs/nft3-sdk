"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./style.css");
function NFT3Button(props) {
    return ((0, jsx_runtime_1.jsxs)("button", { className: "nft3-button", disabled: props.disabled || props.loading, onClick: props.onClick, children: [props.loading && ((0, jsx_runtime_1.jsx)("svg", { fill: "none", stroke: "currentColor", strokeWidth: "4", width: "18", height: "18", viewBox: "0 0 48 48", focusable: "false", strokeLinecap: "butt", strokeLinejoin: "miter", className: "nft3-loading", children: (0, jsx_runtime_1.jsx)("path", { d: "M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6" }) })), props.children] }));
}
exports.default = NFT3Button;
