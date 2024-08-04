import {FC, ChangeEvent, useMemo} from "react";
import cn from "classnames";
import css from "./AmountInput.module.scss";
import {useGetTokenPrice} from "../../../../hooks/useGetTokenPrice.tsx";
import {Token} from "../../../../../networkConfig.ts";

export const isValidPartialFloat = (value: string) => {
    if (!value) {
        return true
    }

    // @ts-ignore
    return !isNaN(value)
}

interface AmountInputProps {
    className?: string
    balance: string
    amount: string
    setAmount?: (value: string) => void
    decimals?: number
    token?: Token
}

export const AmountInput: FC<AmountInputProps> = ({className, amount,
      balance, setAmount, decimals = 18, token}) => {
    //Coingecko API returns price in USD but we need a subscription to it to get the price
    const usdRate = useGetTokenPrice(token?.contractAddress || '')

    const usdPrice = useMemo(() => usdRate?.price ? usdRate.price * Number(amount) : 0, [amount, usdRate.price])

    const handleAmountChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value
        if (!isValidPartialFloat(val)) {
            return
        }
        const digitsAfterDot = val.split('.')[1]?.length
        if (digitsAfterDot && digitsAfterDot > decimals) {
            return
        }
        const value = val.replace(/[^0-9.]/g, '')
        if (setAmount) {
            setAmount(value)
        }
        // if (setError) {
        //     setError(false)
        // }
    }

    return (
        <div className={cn(css.amount, className)}>
            <div className={css.amount__label}>
                <img src={token?.tokenIcon} alt="Token Icon" />
                {token?.tokenText}
            </div>
            <div className={css.amount__field}>
                <input onChange={handleAmountChange} value={amount} type="text" placeholder="0.0000"/>
                <div className={css.amount__text}>
                    <span>Balance: {balance} {token?.tokenText || ""}</span>
                    <span>Price: {usdPrice}</span>
                </div>
            </div>
        </div>
    )
}