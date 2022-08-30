import { PropsWithChildren } from 'react';
import { NFT3Client } from '@nft3sdk/client';
declare type NFT3Theme = 'light' | 'dark';
interface NFT3Context {
    account?: string;
    client?: NFT3Client;
    didname?: string;
    ready?: boolean;
    needRegister: boolean;
    theme: NFT3Theme;
    identifier?: string;
    connect: () => void;
    login: () => Promise<string | undefined>;
    register: (didname: string) => Promise<string>;
    logout: () => void;
    checkLogin: () => Promise<string | undefined>;
    eagerConnect: () => void;
    disconnect: () => void;
}
export declare const NFT3Provider: (props: PropsWithChildren<{
    endpoint: string;
    theme?: NFT3Theme;
    silent?: boolean;
}>) => JSX.Element;
export declare function useNFT3(): NFT3Context;
export {};
