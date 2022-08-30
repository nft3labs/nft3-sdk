"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./style.css");
const NFT3Modal_1 = require("../NFT3Modal");
const NFT3Button_1 = require("../NFT3Button");
const webNFT3_1 = require("../../hooks/webNFT3");
function NFT3Register({ visible, onClose }) {
    const { register } = (0, webNFT3_1.useNFT3)();
    const [value, setValue] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const submit = async () => {
        try {
            setLoading(true);
            await register(value);
        }
        catch (error) {
            console.trace(error);
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)(NFT3Modal_1.default, { visible: visible, onClose: onClose, title: "DID Register", children: (0, jsx_runtime_1.jsxs)("div", { className: "nft3-register", children: [(0, jsx_runtime_1.jsxs)("div", { className: "nft3-register__form", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", className: "nft3-register__input", placeholder: "Your DID name", value: value, onChange: e => {
                                setValue(e.target.value.trim());
                            } }), (0, jsx_runtime_1.jsx)("div", { className: "nft3-register__after", children: ".isme" })] }), (0, jsx_runtime_1.jsx)(NFT3Button_1.default, { disabled: !value, loading: loading, onClick: submit, children: "Register" })] }) }));
}
exports.default = NFT3Register;
