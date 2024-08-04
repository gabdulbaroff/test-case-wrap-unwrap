'use client'
import { useCallback, useEffect, useState } from 'react'
import { useAccount as useWagmiAccount, useDisconnect, useConnect } from 'wagmi'

export const useAccount = () => {
    const { address: wagmiAddress, chainId, isConnected } = useWagmiAccount()
    const [address, setAddress] = useState<`0x${string}` | undefined>(undefined)

    const { disconnect } = useDisconnect()

    const { connect, connectors } = useConnect()

    const walletConnect = useCallback(
        async (connector: string) => {
            try {
                const findedConnector = connectors.find((_connector) => _connector.id === connector)
                if (!findedConnector) {
                    console.error('connector not found')
                    return
                }

                await findedConnector.connect()
                window.location.reload()
            } catch (error) {
                console.log('walletConnect error', error)
            }
        },
        [connectors, connect]
    )

    useEffect(() => {
        if (!isConnected) {
            return setAddress(undefined)
        }
        setAddress(wagmiAddress)
    }, [wagmiAddress, isConnected])

    return {
        address,
        disconnect,
        walletConnect,
        chainId,
    }
}