/// <reference types="react" />
import './style.css';
import { WalletType } from '../../libs/types';
interface Props {
    visible: boolean;
    onClose: (selected?: WalletType) => void;
}
export default function WalletSelect({ visible, onClose }: Props): JSX.Element;
export {};
