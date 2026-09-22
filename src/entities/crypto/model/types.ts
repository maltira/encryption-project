export const CRYPTO_METHODS = ['Подстановка', 'Перестановка'] as const
export type CryptoMethod = typeof CRYPTO_METHODS[number]

export interface CryptoState {
    // Данные (State)
    method: CryptoMethod
    sourceText: string
    resultText: string
    cryptoKey: string

    // Действия (Actions)
    setMethod: (method: CryptoMethod) => void
    setSourceText: (text: string) => void
    setCryptoKey: (key: string) => void

    // Бизнес-логика
    handleEncrypt: () => void
    handleDecrypt: () => void
}
