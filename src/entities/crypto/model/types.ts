export const CRYPTO_METHODS = ['Подстановка', 'Перестановка', 'Гаммирование', 'DES (ECB)'] as const
export type CryptoMethod = typeof CRYPTO_METHODS[number]

export interface Cipher {
    alphabet?: string
    padSymbol?: string
    encrypt: (plainText: string, key: string | number) => string
    decrypt: (cipherText: string, key: string | number) => string
}

export interface HistoryItem {
    id: string
    timestamp: string
    actionType: 'Шифрование' | 'Дешифрование'
    method: CryptoMethod
    key: string | number
    input: string
    output: string
}

export interface CryptoState {
    method: CryptoMethod
    sourceText: string
    resultText: string
    cryptoKey: string | number
    history: HistoryItem[]

    setMethod: (method: CryptoMethod) => void
    setSourceText: (text: string) => void
    setCryptoKey: (key: string | number) => void

    handleEncrypt: () => void
    handleDecrypt: () => void
}
