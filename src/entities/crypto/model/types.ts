import type { SubstitutionCipher } from "../lib"

export const CRYPTO_METHODS = ['Подстановка', 'Перестановка'] as const
export type CryptoMethod = typeof CRYPTO_METHODS[number]

export interface HistoryItem {
    id: string
    timestamp: string
    actionType: 'Шифрование' | 'Дешифрование'
    method: CryptoMethod
    input: string
    output: string
}

export interface CryptoState {
    // Данные (State)
    method: CryptoMethod
    sourceText: string
    resultText: string
    cryptoKey: string
    cipherInstance: SubstitutionCipher
    history: HistoryItem[]

    // Действия (Actions)
    setMethod: (method: CryptoMethod) => void
    setSourceText: (text: string) => void
    setCryptoKey: (key: string) => void

    // Бизнес-логика
    handleEncrypt: () => void
    handleDecrypt: () => void
}
