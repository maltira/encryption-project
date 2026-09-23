import type { Cipher } from '../../model/types'

export class GammaCipher implements Cipher {
    public a: number;
    public c: number;
    public t0: number;
    public b: number;
    public alphabet: string;

    constructor(a: number = 9, c: number = 49, t0: number = 24, b: number = 256) {
        this.a = a
        this.c = c
        this.t0 = t0
        this.b = b
        this.alphabet = Array.from({ length: 256 }, (_, i) => String.fromCharCode(i)).join('')
    }

    public cleanText(sourceText: string): string {
        for (const char of sourceText) {
            if (char.charCodeAt(0) > 255) {
                throw new Error(`Символ '${char}' (код ${char.charCodeAt(0)}) выходит за пределы таблицы ASCII (0-255)`)
            }
        }
        return sourceText
    }


    // Генерация псевдослучайной гаммы заданной длины с помощью ЛКГ:
    // T(i+1) = (A * T(i) + C) mod B
    private generateGamma(length: number): number[] {
        const gamma: number[] = [];
        let current = this.t0;

        for (let i = 0; i < length; i++) {
            current = (this.a * current + this.c) % this.b;
            gamma.push(current);
        }
        return gamma;
    }

    // Шифрование текста гаммированием
    public encrypt(plainText: string): string {
        const chars = Array.from(plainText);
        const gamma = this.generateGamma(chars.length);
        const cipherChars = chars.map((char, i) => {
            const cipherCode = (char.charCodeAt(0) + gamma[i]) % this.b
            return String.fromCharCode(cipherCode)
        })

        return cipherChars.join('')
    }

    // Дешифрование
    public decrypt(cipherText: string): string {
        const chars = Array.from(cipherText);
        const gamma = this.generateGamma(chars.length);
        const decryptedChars = chars.map((char, i) => {
            const decryptedCode = (char.charCodeAt(0) - gamma[i] + this.b) % this.b
            return String.fromCharCode(decryptedCode)
        })

        return decryptedChars.join('')
    }
}