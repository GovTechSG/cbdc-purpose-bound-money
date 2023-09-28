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
        address: '0x09512049d43448a82499db5f3DB2e03BCBC2ee11',
        genesisBlock: 40620681,
    },
    payees: [
        '0x771499FC4D26e0Da1C59240F7dDEe3bB863Ff4BC',
        '0xc23b132A72BE2c122b08F8F5F6874442BAaE9a4A',
    ],
}

export const chainInfoLocal: AppChainInfo = {
    pbm: {
        address: '0x9B9eb636b3dCdB515A4746781D235B1501162275',
        genesisBlock: 0,
    },
    payees: ['0x24ba19062400185a9001EDC9F6200C438F62Fa53'],
}
