import { create } from 'zustand'
import { cleanText, decryptText, encryptText } from '../lib'
import type { CryptoState, HistoryItem } from './types'

export { CRYPTO_METHODS, type CryptoMethod, type CryptoState } from './types'

export const useCryptoStore = create<CryptoState>((set, get) => ({
    method: 'Подстановка',
    sourceText: '',
    resultText: '',
    cryptoKey: 32,
    history: [],

    // Простые экшены изменения полей
    setMethod: (method) => set({ method, resultText: '' }), // Очищаем результат при смене метода
    setSourceText: (sourceText) => set({ sourceText }),
    setCryptoKey: (cryptoKey) => set({ cryptoKey, resultText: '' }),

    // Экшен зашифрования
    handleEncrypt: () => {
        try {
            const { sourceText, method, cryptoKey, history } = get()
            const cleaned = cleanText(sourceText, method)
            const encrypted = encryptText(cleaned, method, cryptoKey)

            const newLog: HistoryItem = {
                id: crypto.randomUUID(),
                timestamp: new Date().toLocaleTimeString(),
                actionType: 'Шифрование',
                method,
                key: cryptoKey,
                input: sourceText,
                output: encrypted,
            }

            set({ resultText: encrypted, history: [newLog, ...history] })
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error)
            set({ resultText: `Ошибка: ${message}` })
        }
    },

    // Экшен дешифрования
    handleDecrypt: () => {
        try {
            const { sourceText, method, cryptoKey, history } = get()
            const decrypted = decryptText(sourceText, method, cryptoKey)

            const newLog: HistoryItem = {
                id: crypto.randomUUID(),
                timestamp: new Date().toLocaleTimeString(),
                actionType: 'Дешифрование',
                method,
                key: cryptoKey,
                input: sourceText,
                output: decrypted,
            }

            set({ resultText: decrypted, history: [newLog, ...history] })
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error)
            set({ resultText: `Ошибка: ${message}` })
        }
    }
}))