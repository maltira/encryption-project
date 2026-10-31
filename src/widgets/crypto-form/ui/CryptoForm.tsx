import { useCryptoStore, MethodSelect, ResultDisplay, CryptoHistory, CIPHERS_MAP, isTextInAlphabet } from '@/entities/crypto'
import { ActionButton } from '@/features/encrypt-decrypt-text'
import { TextArea } from '@/shared/ui'
import { KeyInput } from './KeyInput'
import styles from './CryptoForm.module.css'

export const CryptoForm = () => {
    const { method, sourceText, setSourceText, cryptoKey, gammaParams } = useCryptoStore()
    const cipher = CIPHERS_MAP[method]

    const alphabet = cipher.alphabet || ''
    const inputAlphabet = alphabet && cipher.padSymbol && !alphabet.includes(cipher.padSymbol)
        ? alphabet + cipher.padSymbol
        : alphabet

    const isDesKeyValid = /^[0-9a-fA-F]{16}$/.test(String(cryptoKey))
    const isNumericKeyValid = Number.isInteger(cryptoKey) && Number(cryptoKey) >= 0

    const isKeyValid = method === 'DES (ECB)'
        ? isDesKeyValid
        : method === 'Гаммирование'
            ? true
            : isNumericKeyValid

    const isGammaValid =
        method !== 'Гаммирование' ||
        [gammaParams.A, gammaParams.C, gammaParams.T0].every(
            (v) => Number.isInteger(v) && v >= 0 && v < 256
        )

    const isActionDisabled =
        !sourceText ||
        !isTextInAlphabet(sourceText, inputAlphabet) ||
        !isKeyValid ||
        !isGammaValid

    return (
        <div className={styles.form}>

            <div className={styles.inputForm}>
                <p>Выберите метод</p>
                <MethodSelect />
                {method !== 'DES (ECB)' && method !== 'Гаммирование' && <p>Алфавит: {alphabet}</p>}
                {method === 'Гаммирование' && <p>Алфавит: Расширенная таблица ASCII (коды символов от `0` до `255`, всего 256 символов)</p>}
            </div>

            <KeyInput />

            <div className={styles.innerBlock}>
                <TextArea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder='Исходный текст'
                />

                <div className={styles.buttons}>
                    <ActionButton type='encrypt' disabled={isActionDisabled} />
                    <ActionButton type='decrypt' disabled={isActionDisabled} />
                </div>

                <ResultDisplay error={!isTextInAlphabet(sourceText, inputAlphabet) ? "Недопустимый символ" : ""} />
            </div>

            <CryptoHistory />
        </div>
    )
}