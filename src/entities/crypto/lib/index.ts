import type { Cipher, CryptoMethod } from '../model/types'
import { GammaCipher } from './gamma/gamma'
import { SubstitutionCipher } from './substitution/substitution'
import { TranspositionCipher } from './transposition/transposition'

export { SubstitutionCipher } from './substitution/substitution'
export { TranspositionCipher } from './transposition/transposition'
export { GammaCipher } from './gamma/gamma'
export { cleanAndValidateText } from './common'

export const CIPHERS_MAP: Record<CryptoMethod, Cipher> = {
    'Подстановка': new SubstitutionCipher(),
    'Перестановка': new TranspositionCipher(),
    'Гаммирование': new GammaCipher(),
}

export const getCipher = (method: CryptoMethod): Cipher => {
    const cipher = CIPHERS_MAP[method]
    if (!cipher) {
        throw new Error(`Неизвестный метод шифрования: ${method}`)
    }
    return cipher
}

export const cleanText = (text: string, method: CryptoMethod): string => {
    const cipher = getCipher(method)
    return cipher.cleanText(text)
}

export const encryptText = (text: string, method: CryptoMethod, key?: string): string => {
    const cipher = getCipher(method)
    return cipher.encrypt(text, key)
}

export const decryptText = (text: string, method: CryptoMethod, key?: string): string => {
    const cipher = getCipher(method)
    return cipher.decrypt(text, key)
}