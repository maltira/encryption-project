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
                method !== 'Гаммирование' &&
                <input type='number' placeholder='Введите ключ' value={cryptoKey} onChange={(e) => setCryptoKey(+e.target.value)} />
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