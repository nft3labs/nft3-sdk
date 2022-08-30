import { PropsWithChildren } from 'react';
import './style.css';
interface Props {
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
}
export default function NFT3Button(props: PropsWithChildren<Props>): JSX.Element;
export {};
