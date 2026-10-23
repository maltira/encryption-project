import type { Cipher } from '../../model/types'

export class SubstitutionCipher implements Cipher {
    public alphabet: string;
    public blockSize: number;
    public padSymbol: string;

    public encryptMap: Map<string, string>;
    public decryptMap: Map<string, string>;

    private combinations: string[];
    private lastKey: number | null;

    constructor() {
        this.alphabet = '012';
        this.blockSize = 3;
        this.padSymbol = "0";
        this.encryptMap = new Map<string, string>();
        this.decryptMap = new Map<string, string>();

        // комбинации не зависят от ключа, поэтому строим их один раз
        this.combinations = [];
        this.generateAllCombinations('', this.combinations);
        this.lastKey = null;
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
        // кеш последнего ключа: таблицы для него уже построены
        if (key === this.lastKey) return;

        const combinations = this.combinations;
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

        this.lastKey = key;
    }

    // Зашифровать
    public encrypt(plainText: string, key: number | string): string {
        this.generateTables(+key);
        const blockSize = this.blockSize

        // кол-во блоков текста
        const countBlocks = Math.ceil(plainText.length / blockSize);
        const cipherBlocksArray = new Array<string>(countBlocks)

        // итерируемся блоками длины blockSize
        for (let i = 0; i < countBlocks; i++) {
            let block = plainText.slice(i * blockSize, (i + 1) * blockSize);
            if (i === countBlocks - 1 && block.length % blockSize) {
                block = block.padEnd(blockSize, this.padSymbol)
            }

            cipherBlocksArray[i] = this.encryptMap.get(block) ?? "";
        }

        return cipherBlocksArray.join('');
    }

    // Дешифровать
    public decrypt(cipherText: string, key: number | string): string {
        const blockSize = this.blockSize
        if (cipherText.length % blockSize) {
            throw new Error(`Длина шифртекста должна быть кратна ${blockSize}`);
        }

        this.generateTables(+key);

        // кол-во блоков текста
        const countBlocks = cipherText.length / blockSize;
        const plainBlocksArray = new Array<string>(countBlocks)

        for (let i = 0; i < countBlocks; i++) {
            let block = cipherText.slice(i * blockSize, (i + 1) * blockSize);
            plainBlocksArray[i] = this.decryptMap.get(block) ?? "";
        }

        return plainBlocksArray.join('');
    }
}