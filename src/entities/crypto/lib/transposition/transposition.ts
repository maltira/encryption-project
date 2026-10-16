import type { Cipher } from '../../model/types'

export class TranspositionCipher implements Cipher {
    public alphabet: string;
    public blockSize: number;
    public padSymbol: string;

    private K: number[];

    constructor() {
        this.alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        this.blockSize = 16;
        this.padSymbol = "_";
        this.K = Array.from({ length: this.blockSize }, (_, i) => i);
    }

    // генерация случайной перестановки индексов
    private generateRandomPositions(cryptoKey: number) {
        for (let i = this.blockSize - 1; i > 0; i--) {
            const j = cryptoKey % (i + 1);
            [this.K[i], this.K[j]] = [this.K[j], this.K[i]];
        }
    }

    // Шифрование
    public encrypt(plainText: string, cryptoKey: number | string): string {
        this.generateRandomPositions(+cryptoKey);

        // дополнение до кратности размеру блока
        const text = plainText.padEnd(
            Math.ceil(plainText.length / this.blockSize) * this.blockSize,
            this.padSymbol
        )

        let cipherText = "";

        // итерируемся блоками длины blockSize
        for (let i = 0; i < text.length; i += this.blockSize) {
            const block = text.slice(i, i + this.blockSize);
            const encryptedBlock: string[] = new Array(this.blockSize);

            for (let j = 0; j < this.blockSize; j++) {
                // на позицию j встает символ с индекса K[j]
                encryptedBlock[j] = block[this.K[j]];
            }

            cipherText += encryptedBlock.join("");
        }

        return cipherText;
    }

    // Дешифрование
    public decrypt(cipherText: string, cryptoKey: number | string): string {
        if (cipherText.length % this.blockSize !== 0) {
            throw new Error(`Длина шифртекста должна быть кратна ${this.blockSize}`);
        }

        this.generateRandomPositions(+cryptoKey);
        let plainText = "";

        for (let i = 0; i < cipherText.length; i += this.blockSize) {
            const block = cipherText.slice(i, i + this.blockSize);
            const decryptedBlock: string[] = new Array(this.blockSize);

            for (let j = 0; j < this.blockSize; j++) {
                // обратное преобразование: 
                // возвращаем символ на его исходный индекс K[j]
                decryptedBlock[this.K[j]] = block[j];
            }

            plainText += decryptedBlock.join("");
        }

        return plainText;
    }
}