import { PropsWithChildren } from 'react';
import './style.css';
interface Props {
    title: string;
    visible: boolean;
    onClose: () => void;
}
export default function NFT3Modal({ title, visible, onClose, children }: PropsWithChildren<Props>): JSX.Element;
export {};
