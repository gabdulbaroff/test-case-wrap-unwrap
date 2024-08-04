import ethIcon from './src/assets/eth-icon_24x24.svg';

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

interface Token {
    tokenText: string
    tokenValue: string
    tokenIcon: string
    contractAddress: string
    systemLabel: string
    decimals: number
}

const TOKENS ={
    ETH: {
        tokenText: 'ETH',
        tokenValue: 'ETH',
        tokenIcon: ethIcon,
        contractAddress: '',
        systemLabel: 'ETH',
        decimals: 18,
    },
    WETH: {
        tokenText: 'WETH',
        tokenValue: 'WETH',
        tokenIcon: ethIcon,
        contractAddress: WETH_ADDRESS,
        systemLabel: 'WETH',
        decimals: 18,
    },
}

export {TOKENS, WETH_ADDRESS};
export type { Token };
