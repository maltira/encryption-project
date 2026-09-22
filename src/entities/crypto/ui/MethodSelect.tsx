import { Select } from '@/shared/ui'
import { CRYPTO_METHODS, useCryptoStore, type CryptoMethod } from '../model/store'

export const MethodSelect = () => {
    const { method, setMethod } = useCryptoStore()

    return (
        <Select
            value={method}
            onChange={(e) => setMethod(e.target.value as CryptoMethod)}
            options={CRYPTO_METHODS}
        />
    )
}