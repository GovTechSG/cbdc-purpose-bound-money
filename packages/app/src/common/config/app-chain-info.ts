import { type AppChainInfo } from '@app/utils/get-app-chain-info'

export const chainInfoPolygon: AppChainInfo = {
    pbm: {
        address: '0xBEd3e1879F63d38d0F1463DeA9b0cf606C4C6428',
        genesisBlock: 50733860,
    },
    payees: [
        '0x63A69059B7eB694992704F06dD8C2729121b828b', // CFTE
    ],
}

export const chainInfoMumbai: AppChainInfo = {
    pbm: {
        address: '0x2347F2e9F07F75e6dCc40D92fe3daa073A20DfCB',
        genesisBlock: 40746129,
    },
    payees: [
        '0x771499FC4D26e0Da1C59240F7dDEe3bB863Ff4BC', // Test Payee #1
        '0xc23b132A72BE2c122b08F8F5F6874442BAaE9a4A', // Seth
        '0x63A69059B7eB694992704F06dD8C2729121b828b', // CFTE
    ],
}

export const chainInfoLocal: AppChainInfo = {
    pbm: {
        address: '0x9B9eb636b3dCdB515A4746781D235B1501162275',
        genesisBlock: 0,
    },
    payees: ['0x24ba19062400185a9001EDC9F6200C438F62Fa53'],
}
