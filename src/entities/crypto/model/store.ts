import { create } from 'zustand'
import { decryptText, encryptText } from '../lib'
import type { CryptoState } from './types'

export { CRYPTO_METHODS, type CryptoMethod, type CryptoState } from './types'

export const useCryptoStore = create<CryptoState>((set, get) => ({
    // Начальное состояние
    method: 'Подстановка',
    sourceText: '',
    resultText: '',
    cryptoKey: '',

    // Простые экшены изменения полей
    setMethod: (method) => set({ method, resultText: '' }), // Очищаем результат при смене метода
    setSourceText: (sourceText) => set({ sourceText }),
    setCryptoKey: (cryptoKey) => set({ cryptoKey }),

    // Экшен зашифрования
    handleEncrypt: () => {
        const { sourceText, method, cryptoKey } = get()
        // Вызываем чистую функцию из папки lib
        const encrypted = encryptText(sourceText, method, cryptoKey)
        set({ resultText: encrypted })
    },

    // Экшен расшифрования
    handleDecrypt: () => {
        const { sourceText, method, cryptoKey } = get()
        // Вызываем чистую функцию из папки lib
        const decrypted = decryptText(sourceText, method, cryptoKey)
        set({ resultText: decrypted })
    }
}))