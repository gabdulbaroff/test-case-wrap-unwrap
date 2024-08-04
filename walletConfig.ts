import mmSrc from './src/assets/metamask.svg'
import type { Config } from 'wagmi'
import { createConfig, http } from 'wagmi'
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors'
import { cookieStorage, createStorage } from '@wagmi/core'

export const projectId = 'e7e743d7323fd6a8d8ceb9b7a71077d9'

export const WALLETS = [
    {
        title: 'Metamask',
        image: mmSrc,
        connector: 'metaMaskSDK',
    },
]

const customTestnet = {
    id: 1,
    name: 'Tenderly (Case study withdrawal app)',
    network: 'tenderly',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://virtual.mainnet.rpc.tenderly.co/ac469007-55c4-4f39-9202-fd61ba60a33d']},
        public: {http: ['https://virtual.mainnet.rpc.tenderly.co/ac469007-55c4-4f39-9202-fd61ba60a33d']},
    },
};

const targetConnector = metaMask()

const wagmiConfig = createConfig({
    chains: [customTestnet],
    ssr: true,
    transports: {
        [customTestnet.id]: http(customTestnet.rpcUrls.default.http[0]),
    },
    connectors: [
        coinbaseWallet({
            appName: 'test app',
        }),
        walletConnect({
            projectId,
        }),
        targetConnector,
    ],
    storage: createStorage({
        storage: cookieStorage,
    }),
}) as Config



export { wagmiConfig }
