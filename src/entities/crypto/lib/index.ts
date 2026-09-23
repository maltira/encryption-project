import type { CryptoMethod } from '../model/types'
import type { SubstitutionCipher } from './substitution/substitution';
export { SubstitutionCipher } from './substitution/substitution';

// Функция зашифрования
export const encryptText = (text: string, method: CryptoMethod, key: string, cipher: SubstitutionCipher): string => {
    console.log("encrypt", text, method, key)
    switch (method) {
        case "Подстановка":
            return cipher.encrypt(text)
        default:
            return "encrypt"
    }
}

// Функция расшифрования
export const decryptText = (text: string, method: CryptoMethod, key: string, cipher: SubstitutionCipher): string => {
    console.log("decrypt", text, method, key)
    switch (method) {
        case "Подстановка":
            return cipher.decrypt(text)
        default:
            return "decrypt"
    }
}