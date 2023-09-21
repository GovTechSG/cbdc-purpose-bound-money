import { type AppChainInfo } from '@app/utils/get-app-chain-info'

export const chainInfoPolygon: AppChainInfo = {
    pbm: {
        address: '0x56e932991885B65bc91f719d9dac241E64B6529E',
        genesisBlock: 39239804,
    },
    payees: ['0x24ba19062400185a9001EDC9F6200C438F62Fa53'],
}

export const chainInfoMumbai: AppChainInfo = {
    pbm: {
        address: '0x27fFde7Eeb50d5a7E0288B6142377d0fD7FEA115',
        genesisBlock: 40360319,
    },
    payees: [
        '0x7bd37875BBC40b43Fd6557D6542b5A1b528cD9f4',
        '0xa50B92dA032a0E150dabc8FD4b50C5D1ef7ef94F',
    ],
}

export const chainInfoLocal: AppChainInfo = {
    pbm: {
        address: '0x9B9eb636b3dCdB515A4746781D235B1501162275',
        genesisBlock: 0,
    },
    payees: ['0x24ba19062400185a9001EDC9F6200C438F62Fa53'],
}
