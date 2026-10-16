import { useCryptoStore } from '@/entities/crypto'
import styles from './CryptoForm.module.css'

export const KeyInput = () => {
    const { method, cryptoKey, setCryptoKey } = useCryptoStore()

    if (method === 'Гаммирование') return null

    return (
        <div className={styles.inputForm}>
            <p>Введите ключ {method === 'DES (ECB)' && `(осталось: ${16 - String(cryptoKey).length})`}</p>
            {
                method === 'DES (ECB)' ? (
                    <input
                        type='text'
                        placeholder='Введите 16-значный HEX-ключ (допустимые значения: 0-9, A-F)'
                        value={cryptoKey}
                        maxLength={16}
                        onChange={(e) => {
                            const hexOnly = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 16).toUpperCase()
                            setCryptoKey(hexOnly)
                        }}
                    />
                ) : (
                    <input
                        type='number'
                        placeholder='Введите ключ'
                        value={cryptoKey}
                        onChange={(e) => setCryptoKey(e.target.value === '' ? '' : +e.target.value)}
                    />
                )
            }
        </div>
    )
}
