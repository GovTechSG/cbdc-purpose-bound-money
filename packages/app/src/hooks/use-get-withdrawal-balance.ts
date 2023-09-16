import { usePBMTokenContext } from '@app/contexts/pbm-token-context'
import { PBMVault } from '@contracts/types'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'

export const useGetWithdrawalBalance = (accountAddress: string | undefined) => {
    const [loading, setLoading] = useState(false)
    const [withdrawalBalance, setWithdrawalBalance] = useState(BigNumber.from(0))
    const [withdrawableDepositIds, setWithdrawableDepositIds] = useState<BigNumber[]>([])

    const { vaultContract: pbmVaultContract } = usePBMTokenContext()

    const previewWithdrawalBalance = useCallback(async () => {
        if (!accountAddress || !pbmVaultContract) return

        const fetchWithdrawalBalance = async (payeeAddress: string, pbmVaultContract: PBMVault) => {
            setLoading(true)
            const activeDepositIds = await pbmVaultContract.getActiveDepositIds(payeeAddress)
            const { totalAmount, depositIdsIncluded } = await pbmVaultContract.previewWithdraw(
                payeeAddress,
                activeDepositIds
            )

            setWithdrawalBalance(totalAmount)
            setWithdrawableDepositIds(activeDepositIds.filter((_, idx) => depositIdsIncluded[idx]))
            setLoading(false)
        }

        await fetchWithdrawalBalance(accountAddress, pbmVaultContract)

        pbmVaultContract.on('Withdrawal', async (_: string, from: string) => {
            if (from === accountAddress) {
                await fetchWithdrawalBalance(accountAddress, pbmVaultContract)
            }
        })
    }, [accountAddress, pbmVaultContract])

    useEffect(() => {
        previewWithdrawalBalance()

        return () => {
            pbmVaultContract?.removeAllListeners()
        }
    }, [pbmVaultContract, previewWithdrawalBalance])

    return { withdrawalBalance, withdrawableDepositIds, loading }
}
