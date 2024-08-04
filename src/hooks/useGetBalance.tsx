import { useBalance } from 'wagmi'
import { useAccount } from './useAccount'
import { formatEther } from 'viem'
import {useCallback, useEffect, useState} from 'react'
import {toFixedFloor} from "../utils/toFixedFloor.ts";
import {useEthersSigner} from "./useSigner.tsx";
import { ethers, JsonRpcSigner } from 'ethers'
import { erc20Abi } from 'viem'
// @ts-ignore
import {TOKENS} from "../../networkConfig.ts";

export interface AccountBalance {
    ethBalance: string
    formatedEthBalance: string
    wethBalance: string
    formatedWethBalance: string
}

const DEFAULT_BALANCE: AccountBalance = {
    ethBalance: '0.00',
    formatedEthBalance: '0.00',
    wethBalance: '0.00',
    formatedWethBalance: '0.00',
}

export const useGetBalance = () => {
    const { address, chainId } = useAccount()
    const [balance, setBalance] = useState<AccountBalance>(DEFAULT_BALANCE)
    const signer = useEthersSigner({ chainId: chainId || 0 })
    const { data: nativeBalance } = useBalance({
        chainId,
        address,
    })

    const getWethBalance = async (contractAddress: string, signer: JsonRpcSigner) => {
        try {
            const tokenContract = new ethers.Contract(contractAddress, erc20Abi, signer)
            const address = await signer.getAddress()
            const res = await tokenContract.getFunction('balanceOf(address)')(address)
            return res
        } catch (err) {
            console.error(err, contractAddress)
            return 0n
        }
    }

    const getBalance = useCallback(async () => {
        const result = { ...DEFAULT_BALANCE }

        if (!signer || !nativeBalance) {
            return result
        }

        try {
            const [wethRawBalance, ethRawBalance] = await Promise.all([
                getWethBalance(TOKENS.WETH.contractAddress, signer),
                Promise.resolve(nativeBalance.value),
            ])

            result.ethBalance = formatEther(ethRawBalance)
            result.formatedEthBalance = toFixedFloor(+result.ethBalance, 4)
            result.wethBalance = formatEther(wethRawBalance)
            result.formatedWethBalance = toFixedFloor(+result.wethBalance, 4)
        } catch (error) {
            console.error('Failed to fetch balances:', error)
        }

        return result
    }, [nativeBalance, signer])

    const refreshBalance = useCallback(() => {
        if (address) {
            getBalance().then((result) => setBalance(result))
        } else {
            setBalance(DEFAULT_BALANCE)
        }
    }, [getBalance, address])

    useEffect(() => {
        refreshBalance()
    }, [getBalance, address, refreshBalance])

    return { balance, refreshBalance }
}
