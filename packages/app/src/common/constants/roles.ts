import { ethers } from 'ethers'

export const roles = {
    ADMIN_ROLE: ethers.constants.HashZero,
    TREASURER_ROLE: ethers.utils.id('TREASURER_ROLE'),
    PAYER_ROLE: ethers.utils.id('PAYER_ROLE'),
    PAYEE_ROLE: ethers.utils.id('PAYEE_ROLE'),
}
