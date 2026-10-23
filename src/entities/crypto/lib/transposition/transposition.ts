import type { Cipher } from '../../model/types'

export class TranspositionCipher implements Cipher {
    public alphabet: string;
    public blockSize: number;
    public padSymbol: string;

    private K: number[];
    private lastKey: number | null

    constructor() {
        this.alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        this.blockSize = 16;
        this.padSymbol = "_";
        this.K = Array.from({ length: this.blockSize }, (_, i) => i);
        this.lastKey = null
    }

    // генерация случайной перестановки индексов
    private generateRandomPositions(cryptoKey: number) {
        if (cryptoKey === this.lastKey) return

        const K = Array.from({ length: this.blockSize }, (_, i) => i)
        for (let i = this.blockSize - 1; i > 0; i--) {
            const j = cryptoKey % (i + 1);
            [K[i], K[j]] = [K[j], K[i]];
        }

        this.K = K
        this.lastKey = cryptoKey
    }

    // Шифрование
    public encrypt(plainText: string, cryptoKey: number | string): string {
        this.generateRandomPositions(+cryptoKey);
        const blockSize = this.blockSize

        // кол-во символов текста (с дополнением до кратного)
        const maxLength = Math.ceil(plainText.length / blockSize) * blockSize;
        const cipherBlocksArray = new Array<string>(maxLength)

        // итерируемся блоками blockSize
        for (let i = 0; i < plainText.length; i += blockSize) {
            let block = plainText.slice(i, i + blockSize);
            if (i + blockSize >= plainText.length && block.length % blockSize) {
                block = block.padEnd(blockSize, this.padSymbol)
            }

            for (let j = 0; j < this.blockSize; j++) {
                // на позицию j встает символ с индекса K[j]
                cipherBlocksArray[i + j] = block[this.K[j]];
            }
        }

        return cipherBlocksArray.join('');
    }

    // Дешифрование
    public decrypt(cipherText: string, cryptoKey: number | string): string {
        const blockSize = this.blockSize
        if (cipherText.length % blockSize) {
            throw new Error(`Длина шифртекста должна быть кратна ${blockSize}`);
        }

        this.generateRandomPositions(+cryptoKey);
        const plainBlocksArray = new Array<string>(cipherText.length)

        // итерируемся блоками blockSize
        for (let i = 0; i < cipherText.length; i += blockSize) {
            const block = cipherText.slice(i, i + blockSize);

            for (let j = 0; j < blockSize; j++) {
                // обратное преобразование: 
                // символ с позиции j возвращается на исходный индекс K[j]
                plainBlocksArray[i + this.K[j]] = block[j];
            }
        }

        return plainBlocksArray.join('');
    }
}