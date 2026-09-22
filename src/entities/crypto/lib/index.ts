import type { CryptoMethod } from '../model/types'

// Функция зашифрования
export const encryptText = (text: string, method: CryptoMethod, key: string): string => {
    console.log("encrypt", text, method, key)
    // switch
    return "encrypt"
}

// Функция расшифрования
export const decryptText = (text: string, method: CryptoMethod, key: string): string => {
    console.log("decrypt", text, method, key)
    // switch
    return "decrypt"
}