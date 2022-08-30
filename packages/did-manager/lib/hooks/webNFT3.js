"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNFT3 = exports.NFT3Provider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("@nft3sdk/client");
const EthereumWallet_1 = require("../libs/EthereumWallet");
const SolanaWallet_1 = require("../libs/SolanaWallet");
const WalletSelect_1 = require("../components/WalletSelect");
const NFT3Register_1 = require("../components/NFT3Register");
const context = {
    value: null
};
function useWebNFT3(endpoint) {
    const [ready, setReady] = (0, react_1.useState)(false);
    const [account, setAccount] = (0, react_1.useState)();
    const [wallet, setWallet] = (0, react_1.useState)();
    const [network, setNetwork] = (0, react_1.useState)();
    const [nft3Wallet, setNft3Wallet] = (0, react_1.useState)();
    const [selectVisible, setSelectVisible] = (0, react_1.useState)(false);
    const [needRegister, setNeedRegister] = (0, react_1.useState)(false);
    const [identifier, setIdentifier] = (0, react_1.useState)();
    const connect = (0, react_1.useCallback)(async () => {
        setSelectVisible(true);
    }, []);
    const client = (0, react_1.useMemo)(() => {
        return new client_1.NFT3Client(endpoint);
    }, [endpoint]);
    const didname = (0, react_1.useMemo)(() => {
        if (!identifier)
            return undefined;
        const arr = identifier.split(':');
        return arr[arr.length - 1] + '.isme';
    }, [identifier]);
    (0, react_1.useEffect)(() => {
        const sessionKey = localStorage.getItem('sessionKey') || undefined;
        if (nft3Wallet?.network === 'Ethereum') {
            const signer = nft3Wallet?.provider?.getSigner();
            client.did.config({
                network: 'ethereum',
                signer,
                signKey: sessionKey
            });
        }
        if (nft3Wallet?.network === 'Solana') {
            client.did.config({
                network: 'solana',
                signer: nft3Wallet?.provider,
                signKey: sessionKey
            });
        }
    }, [nft3Wallet, client]);
    // DID register
    const register = (0, react_1.useCallback)(async (identifier) => {
        const result = await client.did?.register(identifier);
        setIdentifier(result.identifier);
        setReady(true);
        return result.identifier;
    }, [client]);
    // DID login
    const login = (0, react_1.useCallback)(async () => {
        try {
            const result = await client.did.login();
            setIdentifier(result.identifier);
            if (client.did.signKey) {
                localStorage.setItem('sessionKey', client.did.signKey);
            }
            return result.identifier;
        }
        catch (error) {
            if (error.code === 32033) {
                setNeedRegister(true);
            }
            else {
                throw error;
            }
        }
    }, [client]);
    // DID logout
    const logout = (0, react_1.useCallback)(() => {
        setIdentifier(undefined);
        localStorage.removeItem('sessionKey');
    }, []);
    // check did login status
    const checkLogin = (0, react_1.useCallback)(async () => {
        try {
            if (!client.did || !client.did.signer)
                return;
            const result = await client.did?.checkLogin();
            setIdentifier(result.identifier);
            return result.identifier;
        }
        catch (error) {
            console.trace(error);
        }
        finally {
            setReady(true);
        }
    }, [client]);
    (0, react_1.useEffect)(() => {
        if (account)
            checkLogin();
    }, [checkLogin, account]);
    // select a wallet
    const onSelect = async (type, silent = false) => {
        let wallet;
        if (type === 'MetaMask') {
            wallet = new EthereumWallet_1.default('MetaMask');
        }
        else {
            wallet = new SolanaWallet_1.default('Phantom');
        }
        await wallet.connect(silent);
        localStorage.setItem('wallet', type);
        wallet.onAccountChanged((accounts) => {
            setAccount(accounts[0] || undefined);
        });
        wallet.onDisconnect(() => {
            setAccount(undefined);
        });
        setWallet(type);
        setNft3Wallet(wallet);
        setAccount(wallet.account || undefined);
    };
    // eager connect wallet
    const eagerConnect = (0, react_1.useCallback)(async () => {
        const wallet = localStorage.getItem('wallet');
        if (wallet === 'Phantom' || wallet === 'MetaMask') {
            onSelect(wallet, true);
        }
    }, []);
    return {
        wallet,
        network,
        nft3Wallet,
        account,
        selectVisible,
        client,
        didname,
        identifier,
        ready,
        needRegister,
        onSelect,
        setAccount,
        setSelectVisible,
        setNeedRegister,
        setNft3Wallet,
        connect,
        login,
        logout,
        checkLogin,
        register,
        setWallet,
        setNetwork,
        eagerConnect
    };
}
function createNFT3Context() {
    context.value = (0, react_1.createContext)({
        account: undefined,
        didname: undefined,
        theme: 'light',
        needRegister: false,
        connect: () => { },
        eagerConnect: () => { },
        disconnect: () => { },
        logout: () => { },
        checkLogin: () => Promise.resolve(undefined),
        login: () => Promise.resolve(undefined),
        register: () => Promise.resolve('')
    });
    const Provider = context.value.Provider;
    return function useNFT3Provider(props) {
        const theme = props.theme || 'light';
        const { account, selectVisible, nft3Wallet, client, didname, ready, identifier, needRegister, onSelect, connect, setAccount, register, login, logout, checkLogin, setSelectVisible, setNeedRegister, eagerConnect } = useWebNFT3(props.endpoint);
        const disconnect = async () => {
            nft3Wallet?.disconnect();
            setAccount(undefined);
        };
        return ((0, jsx_runtime_1.jsxs)(Provider, { value: {
                account,
                client,
                didname,
                ready,
                theme,
                identifier,
                needRegister,
                login,
                logout,
                register,
                checkLogin,
                eagerConnect,
                connect,
                disconnect
            }, children: [props.children, props.silent !== true && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(WalletSelect_1.default, { visible: selectVisible, onClose: wallet => {
                                if (wallet)
                                    onSelect(wallet);
                                setSelectVisible(false);
                            } }), (0, jsx_runtime_1.jsx)(NFT3Register_1.default, { visible: needRegister, onClose: () => setNeedRegister(false) })] }))] }));
    };
}
exports.NFT3Provider = createNFT3Context();
function useNFT3() {
    return (0, react_1.useContext)(context.value);
}
exports.useNFT3 = useNFT3;
