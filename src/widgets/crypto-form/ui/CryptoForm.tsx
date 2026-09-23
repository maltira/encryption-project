import { useCryptoStore, MethodSelect, ResultDisplay, CryptoHistory } from '@/entities/crypto'
import { ActionButton } from '@/features/encrypt-decrypt-text'
import { TextArea } from '@/shared/ui'
import styles from './CryptoForm.module.css'

export const CryptoForm = () => {
    const { sourceText, setSourceText } = useCryptoStore()

    return (
        <div className={styles.form}>
            <MethodSelect />

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