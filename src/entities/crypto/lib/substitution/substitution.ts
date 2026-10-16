import type { Cipher } from '../../model/types'

export class SubstitutionCipher implements Cipher {
    public alphabet: string;
    public blockSize: number;
    public padSymbol: string;

    public encryptMap: Map<string, string>;
    public decryptMap: Map<string, string>;

    constructor() {
        this.alphabet = '012';
        this.blockSize = 3;
        this.padSymbol = "0";
        this.encryptMap = new Map<string, string>();
        this.decryptMap = new Map<string, string>();
    }

    // рекурсивно генерирует все возможные комбинации символов алфавита длины m
    private generateAllCombinations(current: string, result: string[]): void {
        if (current.length === this.blockSize) {
            result.push(current);
            return;
        }
        for (const char of this.alphabet) {
            this.generateAllCombinations(current + char, result);
        }
    }

    // создает случайную биекцию (взаимно однозначную таблицу подстановки)
    private generateTables(key: number): void {
        const combinations: string[] = [];
        this.generateAllCombinations('', combinations);

        const shuffled = [...combinations];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = key % (i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // заполняем мапы подстановки
        for (let i = 0; i < combinations.length; i++) {
            const orig = combinations[i];
            const sub = shuffled[i];
            this.encryptMap.set(orig, sub);
            this.decryptMap.set(sub, orig);
        }
    }

    // Зашифровать
    public encrypt(plainText: string, key: number | string): string {
        this.generateTables(+key);

        // дополнение текста до кратности размеру блока
        const text = plainText.padEnd(
            Math.ceil(plainText.length / this.blockSize) * this.blockSize,
            this.padSymbol
        );

        let cipherText = '';

        // итерируемся блоками длины blockSize
        for (let i = 0; i < text.length; i += this.blockSize) {
            const block = text.slice(i, i + this.blockSize);
            const sub = this.encryptMap.get(block);
            cipherText += sub;
        }

        return cipherText;
    }

    // Дешифровать
    public decrypt(cipherText: string, key: number | string): string {
        if (cipherText.length % this.blockSize !== 0) {
            throw new Error(`Длина шифртекста должна быть кратна ${this.blockSize}`);
        }

        this.generateTables(+key);
        let plainText = '';

        for (let i = 0; i < cipherText.length; i += this.blockSize) {
            const block = cipherText.slice(i, i + this.blockSize);
            const sub = this.decryptMap.get(block);
            plainText += sub;
        }

        return plainText;
    }
}

