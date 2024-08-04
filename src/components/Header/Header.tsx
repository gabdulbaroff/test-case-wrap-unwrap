import css from "./Header.module.scss"
import {useAccount} from "../../hooks/useAccount.tsx";
import {useCallback, useMemo} from "react";
// @ts-ignore
import {WALLETS} from "../../../walletConfig.ts";
import {trimAddress} from "../../utils/trimAddress.ts";

export const Header = () => {
    const {address, walletConnect, disconnect} = useAccount();
    const { connector } = WALLETS[0];

    const formattedAddress = useMemo(() => {
        return address ? trimAddress(address, 6) : "Connect Wallet"
    }, [address])

    const handleConnect = useCallback(() => {
        walletConnect(connector)
    }, [connector, walletConnect]);

    const handleDisconnect = useCallback(() => {
        disconnect();
    }, [disconnect]);

    return (
        <header className={css.header}>
            <div className={css.header__logo}>
                <img src="../../../public/vite.svg" alt="logo" />
            </div>
            <div className={css.header__nav}>
                <nav>
                    <button onClick={handleConnect} className={css.header__button}>
                        <p>{formattedAddress}</p>
                    </button>
                    {address && <button onClick={handleDisconnect}
                        className={css.header__button}>
                        Disconnect
                    </button>}
                </nav>
            </div>
        </header>);
}
