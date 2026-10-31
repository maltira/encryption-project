import type { Cipher } from '../../model/types'

export class GammaCipher implements Cipher {
    public A: number;
    public C: number;
    public T0: number;
    public B: number;
    public alphabet: string;

    constructor() {
        this.A = 9
        this.C = 49
        this.T0 = 24
        this.B = 256
        this.alphabet = Array.from({ length: 256 }, (_, i) => String.fromCharCode(i)).join('')
    }

    public setParams(params: { A: number; C: number; T0: number }): void {
        this.A = params.A
        this.C = params.C
        this.T0 = params.T0
    }

    // Шифрование
    public encrypt(plainText: string): string {
        const cipherBlocksArray = new Array<string>(plainText.length)
        let current = this.T0;

        for (let i = 0; i < plainText.length; i++) {
            current = (this.A * current + this.C) % this.B; // T(i+1) = (A * T(i) + C) mod B
            // C_i = (x_i + k_i) % B
            const charCode = plainText.charCodeAt(i) ^ current;
            cipherBlocksArray[i] = String.fromCharCode(charCode);
        }

        return cipherBlocksArray.join('');
    }

    // Дешифрование
    public decrypt(cipherText: string): string {
        return this.encrypt(cipherText)
    }
}
