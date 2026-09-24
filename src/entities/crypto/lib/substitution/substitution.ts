
import type { Cipher } from '../../model/types'
import { cleanAndValidateText } from '../common'

// 1-й метод: Подстановка

export class SubstitutionCipher implements Cipher {
    public alphabet: string;
    public blockSize: number;
    public padSymbol: string;

    public encryptMap: Map<string, string>;
    public decryptMap: Map<string, string>;

    constructor(alphabet: string = '012', blockSize: number = 3, padSymbol: string = "0",) {
        this.alphabet = alphabet;
        this.blockSize = blockSize;
        this.padSymbol = padSymbol;
        this.encryptMap = new Map<string, string>();
        this.decryptMap = new Map<string, string>();
    }

    public cleanText(sourceText: string): string {
        return cleanAndValidateText(sourceText, this.alphabet)
    }


    // Рекурсивно генерирует все возможные комбинации символов алфавита длины m
    private generateAllCombinations(
        alphabetRunes: string[],
        length: number,
        current: string,
        result: string[]
    ): void {
        if (Array.from(current).length === length) {
            result.push(current);
            return;
        }
        for (const char of alphabetRunes) {
            this.generateAllCombinations(alphabetRunes, length, current + char, result);
        }
    }

    /**
     * Создает случайную биекцию (взаимно однозначную таблицу подстановки)
     */
    private generateTables(key?: number | string): void {
        const alphabetRunes = Array.from(this.alphabet);
        const combinations: string[] = [];

        this.generateAllCombinations(alphabetRunes, this.blockSize, '', combinations);

        // Копируем массив для перемешивания
        const shuffled = [...combinations];

        const numKey = key !== undefined && key !== '' ? Number(key) : undefined;
        // Перемешивание Фишера-Йетса (аналог rand.Shuffle в Go)
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(numKey !== undefined && !isNaN(numKey) ? numKey % (i + 1) : Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Заполняем мапы подстановки
        for (let i = 0; i < combinations.length; i++) {
            const orig = combinations[i];
            const sub = shuffled[i];
            this.encryptMap.set(orig, sub);
            this.decryptMap.set(sub, orig);
        }
    }

    // Зашифровать открытый текст
    public encrypt(plainText: string, key?: number | string): string {
        this.generateTables(key);
        const runes = Array.from(plainText);

        // Дополнение текста до кратности размеру блока
        while (runes.length % this.blockSize !== 0) {
            runes.push(this.padSymbol);
        }

        let cipherText = '';

        // Итерируемся блоками длины blockSize
        for (let i = 0; i < runes.length; i += this.blockSize) {
            const block = runes.slice(i, i + this.blockSize).join('');
            const sub = this.encryptMap.get(block);

            if (sub === undefined) {
                throw new Error(`Неизвестный блок: ${block}`);
            }
            cipherText += sub;
        }

        return cipherText;
    }

    // Расшифровать шифрограмму
    public decrypt(cipherText: string, key?: number | string): string {
        this.generateTables(key);
        const runes = Array.from(cipherText);
        let plainText = '';

        for (let i = 0; i < runes.length; i += this.blockSize) {
            const block = runes.slice(i, i + this.blockSize).join('');
            const sub = this.decryptMap.get(block);

            if (sub === undefined) {
                throw new Error(`Неизвестный блок: ${block}`);
            }
            plainText += sub;
        }

        return plainText;
    }
}

