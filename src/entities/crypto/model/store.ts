import { create } from 'zustand'
import { decryptText, encryptText, SubstitutionCipher } from '../lib'
import type { CryptoState, HistoryItem } from './types'

export { CRYPTO_METHODS, type CryptoMethod, type CryptoState } from './types'

export const useCryptoStore = create<CryptoState>((set, get) => ({
    method: 'Подстановка',
    sourceText: '',
    resultText: '',
    cryptoKey: '',
    history: [],
    cipherInstance: new SubstitutionCipher('012', 3, '0'),

    // Простые экшены изменения полей
    setMethod: (method) => set({ method, resultText: '' }), // Очищаем результат при смене метода
    setSourceText: (sourceText) => set({ sourceText }),
    setCryptoKey: (cryptoKey) => set({ cryptoKey }),

    // Экшен зашифрования
    handleEncrypt: () => {
        try {
            const { sourceText, method, cryptoKey, history, cipherInstance } = get()
            const cleanText = sourceText.replace(/\s+/g, '')
            const encrypted = encryptText(cleanText, method, cryptoKey, cipherInstance)

            const newLog: HistoryItem = {
                id: crypto.randomUUID(),
                timestamp: new Date().toLocaleTimeString(),
                actionType: 'Шифрование',
                method,
                input: cleanText,
                output: encrypted,
            }

            set({ resultText: encrypted, history: [newLog, ...history] })
        } catch (error: any) {
            set({ resultText: `Ошибка: ${error.message}` })
        }
    },

    // Экшен дешифрования
    handleDecrypt: () => {
        try {
            const { sourceText, method, cryptoKey, history, cipherInstance } = get()
            const cleanText = sourceText.replace(/\s+/g, '')
            // Вызываем чистую функцию из папки lib
            const decrypted = decryptText(cleanText, method, cryptoKey, cipherInstance)

            const newLog: HistoryItem = {
                id: crypto.randomUUID(),
                timestamp: new Date().toLocaleTimeString(),
                actionType: 'Дешифрование',
                method,
                input: cleanText,
                output: decrypted,
            }

            set({ resultText: decrypted, history: [newLog, ...history] })
        } catch (error: any) {
            set({ resultText: `Ошибка: ${error.message}` })
        }
    }
}))