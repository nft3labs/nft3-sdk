"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSelect = exports.NFT3Provider = exports.useNFT3 = void 0;
const WalletSelect_1 = require("./components/WalletSelect");
exports.WalletSelect = WalletSelect_1.default;
const webNFT3_1 = require("./hooks/webNFT3");
Object.defineProperty(exports, "useNFT3", { enumerable: true, get: function () { return webNFT3_1.useNFT3; } });
Object.defineProperty(exports, "NFT3Provider", { enumerable: true, get: function () { return webNFT3_1.NFT3Provider; } });
