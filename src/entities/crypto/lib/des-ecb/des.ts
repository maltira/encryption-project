import type { Cipher, CipherKey } from '../../model/types'

// ==========================================
// 1. КОНСТАНТЫ АЛГОРИТМА
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

    private lastKey: string | null;
    private subKeys: number[][];

    constructor() {
        this.alphabet = '';
        this.lastKey = null;
        this.subKeys = [];
    }

    // раундовые ключи для заданного ключа
    private getSubKeys(key: string): number[][] {
        const hex = String(key);
        if (hex !== this.lastKey) {
            this.subKeys = this.createSubKeys(hex);
            this.lastKey = hex;
        }
        return this.subKeys;
    }

    // преобразует HEX-ключ (16 символов) в массив байт, а затем бит
    public parseHexKey(key: string): number[] {
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
            bytes[i] = parseInt(key.slice(i * 2, i * 2 + 2), 16); // числа от 0 до 255
        }
        return this.bytesToBits(bytes); // 8-байтовый массив -> 64-битный
    }

    public createSubKeys(key: string): number[][] {
        const keyBits = this.parseHexKey(key);

        const permutedKey = new Array<number>(56);
        this.permute(keyBits, PC1, permutedKey); // 56 бит перемешиваются по таблице PC-1

        let C = permutedKey.slice(0, 28);
        let D = permutedKey.slice(28, 56);
        const CD = new Array<number>(56);

        const subKeys: number[][] = [];
        for (let i = 0; i < 16; i++) {
            // циклический сдвиг влево (на 1 бит в раундах 1,2,9,16 и на 2 бита во всех ост.)
            const shift = SHIFTS[i];

            if (shift === 1) {
                const c0 = C[0], d0 = D[0];
                for (let j = 0; j < 27; j++) { C[j] = C[j + 1]; D[j] = D[j + 1]; }
                C[27] = c0; D[27] = d0;
            } else {
                const c0 = C[0], c1 = C[1], d0 = D[0], d1 = D[1];
                for (let j = 0; j < 26; j++) { C[j] = C[j + 2]; D[j] = D[j + 2]; }
                C[26] = c0; C[27] = c1;
                D[26] = d0; D[27] = d1;
            }
            // C = C.slice(shift).concat(C.slice(0, shift));
            // D = D.slice(shift).concat(D.slice(0, shift));

            // полученная пара объединяется в 56-битный блок
            for (let j = 0; j < 28; j++) {
                CD[j] = C[j];
                CD[j + 28] = D[j];
            }

            // который пропускается через PC-2; на выходе получается раундовый ключ K из 48 бит
            const roundKey = new Array<number>(48);
            this.permute(CD, PC2, roundKey)
            subKeys.push(roundKey);
        }

        return subKeys;
    }


    // каждый байт разбирается на 8 бит
    private bytesToBits(bytes: Uint8Array): number[] {
        const bits = new Array<number>(bytes.length * 8);
        for (let k = 0; k < bytes.length; k++) {
            const offset = k * 8; // базовое смещение для текущего байта

            bits[offset] = (bytes[k] >> 7) & 1;
            bits[offset + 1] = (bytes[k] >> 6) & 1;
            bits[offset + 2] = (bytes[k] >> 5) & 1;
            bits[offset + 3] = (bytes[k] >> 4) & 1;
            bits[offset + 4] = (bytes[k] >> 3) & 1;
            bits[offset + 5] = (bytes[k] >> 2) & 1;
            bits[offset + 6] = (bytes[k] >> 1) & 1;
            bits[offset + 7] = bytes[k] & 1;
        }
        return bits;
    }

    // каждые 8 бит упаковываются в 1 байт
    private bitsToBytes(bits: number[]): Uint8Array {
        const bytes = new Uint8Array(bits.length / 8);
        for (let i = 0, byteIdx = 0; i < bits.length; i += 8, byteIdx++) {
            bytes[byteIdx] =
                (bits[i] << 7) |
                (bits[i + 1] << 6) |
                (bits[i + 2] << 5) |
                (bits[i + 3] << 4) |
                (bits[i + 4] << 3) |
                (bits[i + 5] << 2) |
                (bits[i + 6] << 1) |
                bits[i + 7];
        }
        return bytes;
    }

    // перестановка по таблице: на позицию i встает элемент входа с номером table[i]
    private permute(input: number[], table: number[], output: number[]) {
        for (let i = 0; i < table.length; i++) {
            output[i] = input[table[i] - 1]
        }
    }

    private f(R: number[], subKey: number[], expandedR: number[], fResult: number[]) {
        this.permute(R, E, expandedR); // расширяем нашу правую сторону с 32 бит до 48
        const xor = expandedR.map((bit, idx) => bit ^ subKey[idx]); // складываем по модулю 2 каждый бит R с соответствующим раундным ключом
        const sOutputBits = new Array<number>(32);

        // S-блоки: делим исходные 48 бит на 8 частей по 6 бит - каждая отправляется в свой S-блок (2-мерная матрица), 
        // чтобы получить из 48 бит обратно 32
        for (let i = 0; i < 8; i++) {
            const offset = i * 6; // нарезка на 6-битные блоки

            const row = (xor[offset] << 1) | xor[offset + 5]; // вычисление индекса (1-й и последний биты) строки (от 0 до 3: 00, 01, 10, 11)
            const col = (xor[offset + 1] << 3) | (xor[offset + 2] << 2) | (xor[offset + 3] << 1) | xor[offset + 4]; // вычисление индекса столбца (средние 4 бита)

            // находим число на пересечении (от 0 до 15), которое можно описать ровно 4 битами
            const val = S_BOXES[i][row][col];

            // и получаем все 4 бита числа;
            // рассчитываем позицию относительно текущей части
            const outOffset = i * 4;
            // и записываем биты
            sOutputBits[outOffset] = (val >> 3) & 1;
            sOutputBits[outOffset + 1] = (val >> 2) & 1;
            sOutputBits[outOffset + 2] = (val >> 1) & 1;
            sOutputBits[outOffset + 3] = val & 1;
        }
        // на выходе в sOutputBits получается массив из 32 бит (8 блоков по 4 бита)

        this.permute(sOutputBits, P, fResult); // перемешиваем (P-box) и записываем в fResult
    }

    public processBlock(blockBytes: Uint8Array, isDecrypt: boolean = false, subKeys: number[][]): Uint8Array {
        const bits = this.bytesToBits(blockBytes); // 8-байтовый блок превращается в 64-битовый блок
        const ipBits = new Array<number>(64);
        this.permute(bits, IP, ipBits); // перестановка данных (изначальная)

        // делим блок на 2 части
        let L = new Array<number>(32);
        let R = new Array<number>(32);
        let nextR = new Array<number>(32)

        for (let i = 0; i < 32; i++) {
            L[i] = ipBits[i]
            R[i] = ipBits[i + 32]
        }

        const expandedR = new Array<number>(48);
        const fResult = new Array<number>(32);

        // 16 раундов сети Фейстеля
        for (let round = 0; round < 16; round++) {
            const K = subKeys[isDecrypt ? 15 - round : round]; // если это дешифрование, то берем ключи в обратном порядке

            // новую R высчитываем по формуле R = L_(i-1) xor f(R_(i-1), K)
            this.f(R, K, expandedR, fResult); // f(R_(i-1), K)
            for (let i = 0; i < 32; i++) {
                nextR[i] = L[i] ^ fResult[i];  // каждый бит L складываем по модулю 2 с битом f
            }

            // делаем что-то типа ротации указателей на массивы, чтобы не создавать
            // лишних аллокация и работы сборщику мусора
            const temp = L; // запоминаем старую левую часть, чтобы исключить уборку мусора, ибо на след строке L указывает уже на другую область памяти (R), а на прошлый массив никто не смотрит, поэтому там включается сборщик мусора
            L = R;          // новая левая часть получает значения правой
            R = nextR;      // новая правая часть получает результат XOR
            nextR = temp;   // берем ненужный старый L как черновик на следующий раунд
            // то есть мы бесплатно для процессора и памяти просто переиспользуем старые указатели
        }
        // получаем блоки L_16 и R_16

        // объединяем их, поменяв местами (RL)
        const preOutput = new Array<number>(64);
        for (let i = 0; i < 32; i++) {
            preOutput[i] = R[i];
            preOutput[i + 32] = L[i];
        }
        const finalBits = new Array<number>(64);
        this.permute(preOutput, IP_INV, finalBits);  // прогоняем через перестановку, обратную начальной (IP)

        return this.bitsToBytes(finalBits);
    }

    // Шифрование
    public encrypt(plainText: string, key: CipherKey): string {
        const encoded = new TextEncoder().encode(plainText);

        // дополнение до кратности 8 байтам (дополняется всегда)
        const padLen = 8 - (encoded.length % 8);
        const data = new Uint8Array(encoded.length + padLen);
        data.set(encoded);
        data.fill(padLen, encoded.length);

        // раундовые ключи
        const subKeys = this.getSubKeys(String(key));

        // каждый блок обрабатываем независимо (ecb)
        const cipherBytes: number[] = [];
        for (let i = 0; i < data.length; i += 8) {
            const block = data.subarray(i, i + 8);
            cipherBytes.push(...this.processBlock(block, false, subKeys));
        }

        // Возвращаем результат в виде HEX-строки
        return cipherBytes
            .map(b => b.toString(16).padStart(2, "0").toUpperCase())
            .join("");
    }

    // Дешифрование
    public decrypt(cipherHex: string, key: CipherKey): string {
        // 1 байт = 2 HEX-символа (по 4 бита), поэтому блок DES (8 байт) занимает 16 символов.
        // Шифртекст всегда состоит из целого числа блоков (padding до кратности 8),
        // значит длина HEX-строки должна делиться на 16
        if (cipherHex.length % 16 !== 0) {
            throw new Error("Длина HEX-шифртекста должна быть кратна 16 символам (64 битам)");
        }

        const cipherBytes = new Uint8Array(cipherHex.length / 2);
        for (let i = 0; i < cipherBytes.length; i++) {
            cipherBytes[i] = parseInt(cipherHex.slice(i * 2, i * 2 + 2), 16);
        }

        const plainBytes: number[] = [];
        const subKeys = this.getSubKeys(String(key));
        for (let i = 0; i < cipherBytes.length; i += 8) {
            const block = cipherBytes.subarray(i, i + 8);
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
        } catch (e) {
            throw new Error("Не удалось декодировать текст: неверный ключ шифрования (" + e + ")");
        }
    }
}

// ==========================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ СЛАБЫХ КЛЮЧЕЙ
// ==========================================

// const des = new DESCipher();
// const weakKey = "0101010101010101";

// // 1. берем ровно 8 байт (64 бита) сырых данных
// const OT = "WeakKey!";
// const inputBytes = new TextEncoder().encode(OT);

// // 2. получаем раундовые ключи
// const subKeys = des.createSubKeys(weakKey);

// // 3. первое шифрование блока: C = DES(K, OT)
// const cipherBytes1 = des.processBlock(inputBytes, false, subKeys);

// // 4. второе шифрование ТОГО ЖЕ блока: C2 = DES(K, DES(K, OT))
// const cipherBytes2 = des.processBlock(cipherBytes1, false, subKeys);

// // 5. проверяем байт-в-байт
// const recoveredText = new TextDecoder().decode(new Uint8Array(cipherBytes2));

// console.log("Исходный текст:              ", OT);
// console.log("Текст после двух шифрований: ", recoveredText);
// console.log("DES(K, DES(K, OT)) === OT:     ", recoveredText === OT);

// ==========================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ ЧАСТИЧНО-СЛАБЫХ КЛЮЧЕЙ
// ==========================================

// const des = new DESCipher();
// const weakKey1 = "01FE01FE01FE01FE";
// const weakKey2 = "FE01FE01FE01FE01";

// // 1. берем ровно 8 байт (64 бита) сырых данных
// const OT = "WeakKey!";
// const inputBytes = new TextEncoder().encode(OT);

// // 2. получаем раундовые ключи
// const subKeys1 = des.createSubKeys(weakKey1);
// const subKeys2 = des.createSubKeys(weakKey2);

// // 3. первое шифрование блока: C = DES(K2, OT)
// const cipherBytes1 = des.processBlock(inputBytes, false, subKeys2);

// // 4. второе шифрование ТОГО ЖЕ блока: C2 = DES(K1, DES(K2, OT))
// const cipherBytes2 = des.processBlock(cipherBytes1, false, subKeys1);

// // 5. проверяем байт-в-байт
// const recoveredText = new TextDecoder().decode(new Uint8Array(cipherBytes2));

// console.log("Исходный текст:              ", OT);
// console.log("Текст после двух шифрований: ", recoveredText);
// console.log("DES(K1, DES(K2, OT)) === OT:     ", recoveredText === OT);