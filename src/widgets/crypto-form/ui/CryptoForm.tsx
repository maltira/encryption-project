import { useCryptoStore, MethodSelect, ResultDisplay, CryptoHistory } from '@/entities/crypto'
import { ActionButton } from '@/features/encrypt-decrypt-text'
import { TextArea } from '@/shared/ui'
import styles from './CryptoForm.module.css'

export const CryptoForm = () => {
    const { method, sourceText, setSourceText, cryptoKey, setCryptoKey } = useCryptoStore()

    return (
        <div className={styles.form}>

            <MethodSelect />

            {
                method !== 'Гаммирование' && (
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
                            onChange={(e) => setCryptoKey(+e.target.value)}
                        />
                    )
                )
            }

            <div className={styles.innerBlock}>
                <TextArea value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder='Исходный текст' />

                <div className={styles.buttons}>
                    <ActionButton type='encrypt' />
                    <ActionButton type='decrypt' />
                </div>

                <ResultDisplay />
            </div>

            <CryptoHistory />
        </div>
    )
}