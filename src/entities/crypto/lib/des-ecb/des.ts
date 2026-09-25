import type { Cipher } from '../../model/types'

// ==========================================
// 1. ТАБЛИЦЫ АЛГОРИТМА DES
// ==========================================

const IP: number[] = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

const IP_INV: number[] = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

const E: number[] = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
];

const P: number[] = [
    16, 7, 20, 21, 29, 12, 28, 17,
    1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9,
    19, 13, 30, 6, 22, 11, 4, 25
];

const S_BOXES: number[][][] = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

const PC1: number[] = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
];

const SHIFTS: number[] = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const PC2: number[] = [
    14, 17, 11, 24, 1, 5,
    3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8,
    16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
];

// ==========================================
// 2. КЛАСС DES
// ==========================================

export class DESCipher implements Cipher {
    public alphabet: string;

    constructor() {
        this.alphabet = '';
    }

    public cleanText(sourceText: string): string {
        return sourceText;
    }

    public parseHexKey(key?: number | string): number[] {
        if (key === undefined || key === null || String(key).trim() === '') {
            throw new Error("Необходимо ввести 16-значный HEX-ключ");
        }

        const clean = String(key).replace(/\s+/g, "");
        if (!/^[0-9a-fA-F]{16}$/.test(clean)) {
            throw new Error(`Ключ должен состоять из 16 HEX-символов (получено: ${clean.length}).`);
        }

        const bytes: number[] = [];
        for (let i = 0; i < 16; i += 2) {
            bytes.push(parseInt(clean.slice(i, i + 2), 16));
        }
        return bytes;
    }

    private bytesToBits(bytes: number[]): number[] {
        const bits = new Array(bytes.length * 8);
        let index = 0;
        for (const byte of bytes) {
            for (let i = 7; i >= 0; i--) {
                bits[index++] = (byte >> i) & 1;
            }
        }
        return bits;
    }

    private bitsToBytes(bits: number[]): number[] {
        const bytes = new Array(bits.length / 8)
        let index = 0;
        for (let i = 0; i < bits.length; i += 8) {
            let byte = 0;
            for (let j = 0; j < 8; j++) {
                byte = (byte << 1) | bits[i + j];
            }
            bytes[index++] = (byte);
        }
        return bytes;
    }

    private permute(input: number[], table: number[]): number[] {
        return table.map(pos => input[pos - 1]);
    }

    private leftShift(bits: number[], n: number): number[] {
        return bits.slice(n).concat(bits.slice(0, n));
    }

    private createSubKeys(keyBytes: number[]): number[][] {
        const keyBits = this.bytesToBits(keyBytes); // 8-байтовый массив в 64-битный
        const permutedKey = this.permute(keyBits, PC1); // 56 бит перемешиваются по таблице PC-1

        let C = permutedKey.slice(0, 28);
        let D = permutedKey.slice(28, 56);

        const subKeys: number[][] = [];
        for (let i = 0; i < 16; i++) {
            // половины сдвигаются влево (на 1 бит в раундах 1,2,9,16 и на 2 бита во всех ост.)
            C = this.leftShift(C, SHIFTS[i]);
            D = this.leftShift(D, SHIFTS[i]);

            // полученная пара объединяется в 56-битный блок, который пропускается через PC-2
            const CD = C.concat(D);
            subKeys.push(this.permute(CD, PC2));
            // на выходе получается раундовый ключ K из 48 бит
        }
        return subKeys;
    }

    private getSubKeys(key?: number | string): number[][] {
        const keyBytes = this.parseHexKey(key);
        return this.createSubKeys(keyBytes);
    }

    private f(R: number[], subKey: number[]): number[] {
        const expandedR = this.permute(R, E); // расширяем нашу правую сторону с 32 бит до 48
        const xor = expandedR.map((bit, idx) => bit ^ subKey[idx]); // складываем по модулю 2 каждый бит R с соответствующим раундным ключом
        const sOutputBits: number[] = [];

        // S-блоки: делим исходные 48 бит на 8 частей по 6 бит - каждая отправляется в свой S-блок (2-мерная матрица), 
        // чтобы получить из 48 бит обратно 32
        for (let i = 0; i < 8; i++) {
            const chunk = xor.slice(i * 6, (i + 1) * 6); // нарезка на 6-битные блоки

            const row = (chunk[0] << 1) | chunk[5]; // вычисление индекса (1-й и последний биты) строки (от 0 до 3: 00, 01, 10, 11)
            const col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4]; // вычисление индекса столбца (средние 4 бита)

            const val = S_BOXES[i][row][col]; // находим число на пересечении (от 0 до 15), которое можно описать ровно 4 битами
            for (let b = 3; b >= 0; b--) {  // превращаем число в массив из 4 бит
                sOutputBits.push((val >> b) & 1);
            }
        }
        // на выходе в sOutputBits получается массив из 32 бит (8 блоков по 4 бита)

        return this.permute(sOutputBits, P); // перемешиваем (P-box)
    }

    private processBlock(blockBytes: number[], isDecrypt: boolean = false, subKeys: number[][]): number[] {
        const bits = this.bytesToBits(blockBytes); // 8-байтовый блок превращается в 64-битовый блок
        const ipBits = this.permute(bits, IP); // перестановка данных (изначальная)

        // делим блок на 2 части
        let L = ipBits.slice(0, 32);
        let R = ipBits.slice(32, 64);

        for (let i = 0; i < 16; i++) { // 16 раундов сети Фейстеля
            const key = isDecrypt ? subKeys[15 - i] : subKeys[i]; // если это дешифрование, то берем ключи в обратном порядке

            // новая L = R_(i-1)
            const nextL = R;

            // а новую R высчитываем по формуле R = L_(i-1) xor f(R_(i-1), K)
            const fResult = this.f(R, key); // f(R_(i-1), K)
            const nextR = L.map((bit, idx) => bit ^ fResult[idx]); // каждый бит L складываем по модулю 2 с битом f

            L = nextL;
            R = nextR;
        }
        // получаем блоки L_16 и R_16

        const preOutput = R.concat(L); // объединяем их, поменяв местами - сначала R потом L
        const finalBits = this.permute(preOutput, IP_INV); // прогоняем через перестановку, обратную начальной (IP)

        return this.bitsToBytes(finalBits); // исходный 64-битный массив превращаем в 8-байтовый
    }

    // Шифрование текста
    public encrypt(plainText: string, key?: number | string): string {
        const encoder = new TextEncoder();
        const data = Array.from(encoder.encode(plainText));

        // Дополнение до кратности 8 байтам
        const padLen = 8 - (data.length % 8);
        for (let i = 0; i < padLen; i++) {
            data.push(padLen);
        }

        // каждый блок обрабатываем независимо (ecb)
        const cipherBytes: number[] = [];
        const subKeys = this.getSubKeys(key);
        for (let i = 0; i < data.length; i += 8) {
            const block = data.slice(i, i + 8);
            cipherBytes.push(...this.processBlock(block, false, subKeys));
        }

        // Возвращаем результат в виде HEX-строки
        return cipherBytes
            .map(b => b.toString(16).padStart(2, "0").toUpperCase())
            .join("");
    }

    // Дешифрование
    public decrypt(cipherHex: string, key?: number | string): string {
        const cleanHex = cipherHex.replace(/\s+/g, "");
        if (cleanHex.length % 16 !== 0) {
            throw new Error("Длина HEX-шифртекста должна быть кратна 16 символам");
        }

        const cipherBytes: number[] = [];
        for (let i = 0; i < cleanHex.length; i += 2) {
            cipherBytes.push(parseInt(cleanHex.slice(i, i + 2), 16));
        }

        const plainBytes: number[] = [];
        const subKeys = this.getSubKeys(key);
        for (let i = 0; i < cipherBytes.length; i += 8) {
            const block = cipherBytes.slice(i, i + 8);
            plainBytes.push(...this.processBlock(block, true, subKeys)); // флаг true - дешифрование
        }

        // Снятие дополнения PKCS#7
        const padLen = plainBytes[plainBytes.length - 1];
        let validPadding = true;
        if (padLen >= 1 && padLen <= 8) {
            for (let i = plainBytes.length - padLen; i < plainBytes.length; i++) {
                if (plainBytes[i] !== padLen) {
                    validPadding = false;
                    break;
                }
            }
        } else {
            validPadding = false;
        }

        if (!validPadding) {
            throw new Error("Неверный ключ или поврежденное дополнение (PKCS#7 padding)");
        }

        const trimmedBytes = plainBytes.slice(0, plainBytes.length - padLen);

        const decoder = new TextDecoder("utf-8", { fatal: true });
        try {
            return decoder.decode(new Uint8Array(trimmedBytes));
        } catch {
            throw new Error("Не удалось декодировать текст: неверный ключ шифрования");
        }
    }
}