
import type { Cipher } from '../../model/types'
import { cleanAndValidateText } from '../common'

export class TranspositionCipher implements Cipher {
    public alphabet: string;
    public blockSize: number;
    public padSymbol: string;

    // key[j] содержит индекс символа (0-based) в исходном блоке,
    // который встает на позицию j шифртекста
    private key: number[];

    constructor(
        alphabet: string = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя",
        blockSize: number = 16,
        padSymbol: string = "_",
    ) {
        this.alphabet = alphabet;
        this.blockSize = blockSize;
        this.padSymbol = padSymbol;
        this.key = this.generateRandomKey();
    }

    public cleanText(sourceText: string): string {
        return cleanAndValidateText(sourceText, this.alphabet)
    }


    // генерация случайной перестановки индексов [0, ..., blockSize - 1] (Fisher-Yates)
    private generateRandomKey(): number[] {
        const key = Array.from({ length: this.blockSize }, (_, i) => i);
        for (let i = key.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [key[i], key[j]] = [key[j], key[i]];
        }
        return key;
    }

    public encrypt(plainText: string): string {
        const chars = Array.from(plainText);

        // дополнение (padding) до кратности размеру блока
        while (chars.length % this.blockSize !== 0) {
            chars.push(this.padSymbol);
        }

        let cipherText = "";

        // Обработка блоков по blockSize символов
        for (let i = 0; i < chars.length; i += this.blockSize) {
            const block = chars.slice(i, i + this.blockSize);
            const encryptedBlock: string[] = new Array(this.blockSize);

            for (let j = 0; j < this.blockSize; j++) {
                // На позицию j встает символ с индекса key[j] из исходного блока
                encryptedBlock[j] = block[this.key[j]];
            }

            cipherText += encryptedBlock.join("");
        }

        return cipherText;
    }

    public decrypt(cipherText: string): string {
        const chars = Array.from(cipherText);

        if (chars.length % this.blockSize !== 0) {
            throw new Error(`Длина шифртекста должна быть кратна ${this.blockSize}`);
        }

        let plainText = "";

        for (let i = 0; i < chars.length; i += this.blockSize) {
            const block = chars.slice(i, i + this.blockSize);
            const decryptedBlock: string[] = new Array(this.blockSize);

            for (let j = 0; j < this.blockSize; j++) {
                // Обратное преобразование: возвращаем символ на его исходный индекс key[j]
                decryptedBlock[this.key[j]] = block[j];
            }

            plainText += decryptedBlock.join("");
        }

        return plainText;
    }
}