import type { Cipher } from '../../model/types'

export class GammaCipher implements Cipher {
    public A: number;
    public C: number;
    public T0: number;
    public B: number;
    public alphabet: string;

    private gamma: number[];

    constructor() {
        this.A = 9
        this.C = 49
        this.T0 = 24
        this.B = 256
        this.alphabet = Array.from({ length: 256 }, (_, i) => String.fromCharCode(i)).join('')
        this.gamma = this.generateGamma(this.B)
    }

    // генерация псевдослучайной гаммы заданной длины:
    // T(i+1) = (A * T(i) + C) mod B
    private generateGamma(length: number): number[] {
        const gamma: number[] = [];
        let current = this.T0;

        for (let i = 0; i < length; i++) {
            current = (this.A * current + this.C) % this.B;
            gamma.push(current);
        }
        return gamma;
    }

    // наложение гаммы на текст: 1 - шифрование, -1 - дешифрование
    private applyGamma(text: string, direction: 1 | -1): string {
        const cipherBlocksArray = new Array<string>(text.length)

        for (let i = 0; i < text.length; i++) {
            // C_i = (x_i + k_i) % B
            // P_i = (y_i - k_i + B) % B
            const charCode = (text.charCodeAt(i) + direction * this.gamma[i % this.B] + this.B) % this.B;
            cipherBlocksArray[i] = String.fromCharCode(charCode);
        }

        return cipherBlocksArray.join('');
    }

    // Шифрование
    public encrypt(plainText: string): string {
        return this.applyGamma(plainText, 1)
    }

    // Дешифрование
    public decrypt(cipherText: string): string {
        return this.applyGamma(cipherText, -1)
    }
}
