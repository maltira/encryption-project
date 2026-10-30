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

    // Шифрование
    public encrypt(plainText: string): string {
        const cipherBlocksArray = new Array<string>(plainText.length)

        for (let i = 0; i < plainText.length; i++) {
            // C_i = (x_i + k_i) % B
            const charCode = (plainText.charCodeAt(i) + this.gamma[i % this.B]) % this.B;
            cipherBlocksArray[i] = String.fromCharCode(charCode);
        }

        return cipherBlocksArray.join('');
    }

    // Дешифрование
    public decrypt(cipherText: string): string {
        const plainBlocksArray = new Array<string>(cipherText.length)

        for (let i = 0; i < cipherText.length; i++) {
            // P_i = (y_i - k_i + B) % B
            const charCode = (cipherText.charCodeAt(i) - this.gamma[i % this.B] + this.B) % this.B;
            plainBlocksArray[i] = String.fromCharCode(charCode);
        }

        return plainBlocksArray.join('');
    }
}
