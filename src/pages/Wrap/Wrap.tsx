import {FC, useCallback, useMemo, useState} from "react";
import css from "./Wrap.module.scss"
import {useGetBalance} from "../../hooks/useGetBalance.tsx";
import {DEFAULT_WRAP_TOKEN} from "./const.ts";
import {SwitchTransfer} from "./components/SwitchTransfer/SwitchTransfer.tsx";
import {AmountInput} from "./components/AmountInput/AmountInput.tsx";
import {useAccount} from "../../hooks/useAccount.tsx";
import {ethers} from "ethers";
// @ts-ignore
import { WETH_ABI } from "../../abi/WETH";
import {useEthersSigner} from "../../hooks/useSigner.tsx";
import {TOKENS} from "../../../networkConfig.ts";
import { parseEther } from 'viem'
import {toast} from "react-toastify";

const WETH_ADDRESS = TOKENS.WETH.contractAddress;

export const Wrap: FC = () => {
    const { balance, refreshBalance } = useGetBalance()
    const [token, setToken] = useState(DEFAULT_WRAP_TOKEN)
    const [amount, setAmount] = useState<string>('')
    const {address, chainId} = useAccount();
    const signer = useEthersSigner({ chainId: chainId || 0 })
    const [txLoading, setTxLoading] = useState(false)

    const onHandleReset = useCallback(() => {
        setAmount('')
    }, [])

    const handleSwitch = useCallback(() => {
        onHandleReset();
        setToken((prev) => {
            return {
                from: prev.to,
                to: prev.from,
            }
        })
    }, [onHandleReset])

    const fromBalance = useMemo(() => {
        return token.from.tokenText == 'ETH' ? balance.formatedEthBalance : balance.formatedWethBalance
    },[balance.formatedEthBalance, balance.formatedWethBalance, token.from.tokenText])

    const toBalance = useMemo(() => {
        return token.to.tokenText == 'ETH' ? balance.formatedEthBalance : balance.formatedWethBalance
    }, [balance.formatedEthBalance, balance.formatedWethBalance, token.to.tokenText])

    const notEnough = useMemo(() => amount && +amount > +fromBalance, [amount, fromBalance])

    const wrapETH = useCallback(async () => {
        if (!address || !amount) return;
        try {
            const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
            const transaction = await wethContract.deposit({
                value: parseEther(amount)
            });
            await transaction.wait();

            toast.success(`Successfully wrapped ${amount} ETH`)
            refreshBalance();
        } catch (e) {
            toast.error('Error while wrapping ETH')
        }
    }, [address, amount, refreshBalance, signer]);

    const unwrapWETH = useCallback(async () => {
        if (!address || !amount) return;
        try {
            const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
            const transaction = await wethContract.withdraw(parseEther(amount));
            await transaction.wait();
            
            toast.success(`Successfully unwrapped ${amount} WETH`)
            refreshBalance();
        } catch (e) {
            toast.error('Error while unwrapping WETH')
        }
    }, [address, amount, refreshBalance, signer]);

    const handleSubmitWrap = useCallback(async () => {
        setTxLoading(true)
        if (token.from.tokenText == 'ETH') {
            await wrapETH()
        } else {
            await unwrapWETH()
        }
        setTxLoading(false)
    }, [token.from.tokenText, unwrapWETH, wrapETH])

    const buttonData = useMemo(() => {
        if (notEnough) {
            return {
                text: "Not enough balance",
                disabled: true,
            }
        }

        if (token.from.tokenText == 'ETH') {
            return {
                text: "Wrap",
                disabled: !amount || txLoading,
            }
        }

        return {
            text: "Unwrap",
            disabled: !amount || txLoading,
        }
    }, [amount, notEnough, token.from.tokenText, txLoading])
    
    return (
        <div className={css.wrap}>
            <div className={css.wrap__container}>
                <h4 className={css.wrap__title}>Wrap / Unwrap</h4>
                <div className={css.wrap__form}>
                    <AmountInput token={token.from} balance={fromBalance} amount={amount} setAmount={setAmount} className={css.wrap__from} />
                    <SwitchTransfer className={css.wrap__switch} onSwitch={handleSwitch} />
                    <AmountInput token={token.to} balance={toBalance} amount={amount} className={css.wrap__to} />
                    <div className={css.wrap__submit}>
                        <button disabled={buttonData.disabled} onClick={handleSubmitWrap}>{buttonData.text}</button>
                    </div>
            </div>
            </div>
        </div>
    )
}