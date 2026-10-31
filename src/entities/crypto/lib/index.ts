import type { Cipher, CryptoMethod, GammaParams } from '../model/types'
import { DESCipher } from './des-ecb/des'
import { GammaCipher } from './gamma/gamma'
import { SubstitutionCipher } from './substitution/substitution'
import { TranspositionCipher } from './transposition/transposition'

export { SubstitutionCipher } from './substitution/substitution'
export { TranspositionCipher } from './transposition/transposition'
export { GammaCipher } from './gamma/gamma'
export { DESCipher } from './des-ecb/des'
export { isTextInAlphabet } from './common'

export const CIPHERS_MAP: Record<CryptoMethod, Cipher> = {
    'Подстановка': new SubstitutionCipher(),
    'Перестановка': new TranspositionCipher(),
    'Гаммирование': new GammaCipher(),
    'DES (ECB)': new DESCipher(),
}

const applyGammaParams = (method: CryptoMethod, gamma?: GammaParams) => {
    if (method === 'Гаммирование' && gamma) {
        (CIPHERS_MAP['Гаммирование'] as GammaCipher).setParams(gamma)
    }
}

export const encryptText = (
    text: string,
    method: CryptoMethod,
    key: string | number,
    gamma?: GammaParams,
): string => {
    applyGammaParams(method, gamma)
    return CIPHERS_MAP[method].encrypt(text, key)
}

export const decryptText = (
    text: string,
    method: CryptoMethod,
    key: string | number,
    gamma?: GammaParams,
): string => {
    applyGammaParams(method, gamma)
    return CIPHERS_MAP[method].decrypt(text, key)
}