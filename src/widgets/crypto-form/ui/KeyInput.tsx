import { useCryptoStore } from '@/entities/crypto'
import styles from './CryptoForm.module.css'

export const KeyInput = () => {
    const { method, cryptoKey, setCryptoKey, gammaParams, setGammaParams } = useCryptoStore()

    if (method === 'Гаммирование') {
        return (
            <div className={styles.inputForm}>
                <p>Параметры LCG: T(i+1) = (A·T(i) + C) mod 256</p>
                <div style={{ display: 'flex', gap: 8 }}>
                    <label>
                        A
                        <input
                            type='number'
                            min={0}
                            value={gammaParams.A}
                            onChange={(e) => setGammaParams({ A: +e.target.value })}
                        />
                    </label>
                    <label>
                        C
                        <input
                            type='number'
                            min={0}
                            value={gammaParams.C}
                            onChange={(e) => setGammaParams({ C: +e.target.value })}
                        />
                    </label>
                    <label>
                        T0
                        <input
                            type='number'
                            min={0}
                            value={gammaParams.T0}
                            onChange={(e) => setGammaParams({ T0: +e.target.value })}
                        />
                    </label>
                </div>
            </div>
        )
    }

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
