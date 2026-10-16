import { create } from 'zustand'
import { decryptText, encryptText } from '../lib'
import type { CryptoState, HistoryItem } from './types'

export { CRYPTO_METHODS, type CryptoMethod, type CryptoState } from './types'

export const useCryptoStore = create<CryptoState>((set, get) => ({
    method: 'Подстановка',
    sourceText: '',
    resultText: '',
    cryptoKey: 32,
    history: [],

    setMethod: (method) => set({
        method,
        sourceText: '', // сбрасываем поля ввода и ключ
        resultText: '',
        cryptoKey: method === 'DES (ECB)' ? '' : 32,
    }),
    setSourceText: (sourceText) => set({ sourceText }),
    setCryptoKey: (cryptoKey) => set({ cryptoKey, resultText: '' }),

    handleEncrypt: () => {
        try {
            const { sourceText, method, cryptoKey, history } = get()
            const encrypted = encryptText(sourceText, method, cryptoKey)

            const newLog: HistoryItem = {
                id: crypto.randomUUID(),
                timestamp: new Date().toLocaleTimeString(),
                actionType: 'Шифрование',
                method,
                key: method === 'Гаммирование' ? '-' : cryptoKey,
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
                key: method === 'Гаммирование' ? '-' : cryptoKey,
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