"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./style.css");
const NFT3Modal_1 = require("../NFT3Modal");
const metamask_svg_1 = require("../../assets/metamask.svg");
const phantom_svg_1 = require("../../assets/phantom.svg");
function WalletSelect({ visible, onClose }) {
    const selected = (0, react_1.useRef)();
    const wallets = [
        {
            wallet: 'MetaMask',
            icon: metamask_svg_1.default,
            link: 'https://metamask.io/download/',
            check: () => {
                return 'ethereum' in window;
            }
        },
        {
            wallet: 'Phantom',
            icon: phantom_svg_1.default,
            link: 'https://phantom.app/download',
            check: () => {
                return 'phantom' in window;
            }
        }
    ];
    const closeModal = () => {
        if (selected.current !== undefined) {
            const wallet = wallets[selected.current];
            onClose?.(wallet.wallet);
        }
        else {
            onClose();
        }
        selected.current = undefined;
    };
    return ((0, jsx_runtime_1.jsx)(NFT3Modal_1.default, { title: "Connect Wallet", visible: visible, onClose: closeModal, children: (0, jsx_runtime_1.jsx)("div", { className: "nft3-wallet__list", children: wallets.map((item, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "nft3-wallet__item", onClick: () => {
                    if (item.check()) {
                        selected.current = i;
                        closeModal();
                    }
                    else
                        window.open(item.link);
                }, children: [(0, jsx_runtime_1.jsx)("span", { children: item.check() ? item.wallet : `Install ${item.wallet}` }), (0, jsx_runtime_1.jsx)("img", { src: item.icon, alt: "", className: "nft3-wallet__icon" })] }, i))) }) }));
}
exports.default = WalletSelect;
