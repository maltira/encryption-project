export const CRYPTO_METHODS = ['Подстановка', 'Перестановка', 'Гаммирование'] as const
export type CryptoMethod = typeof CRYPTO_METHODS[number]

export interface Cipher {
    alphabet?: string
    cleanText: (sourceText: string) => string
    encrypt: (plainText: string, key?: number) => string
    decrypt: (cipherText: string, key?: number) => string
}

export interface HistoryItem {
    id: string
    timestamp: string
    actionType: 'Шифрование' | 'Дешифрование'
    method: CryptoMethod
    key: number
    input: string
    output: string
}

export interface CryptoState {
    // Данные (State)
    method: CryptoMethod
    sourceText: string
    resultText: string
    cryptoKey: number
    history: HistoryItem[]

    // Действия (Actions)
    setMethod: (method: CryptoMethod) => void
    setSourceText: (text: string) => void
    setCryptoKey: (key: number) => void

    // Бизнес-логика
    handleEncrypt: () => void
    handleDecrypt: () => void
}
