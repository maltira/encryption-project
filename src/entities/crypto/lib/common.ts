export function cleanAndValidateText(sourceText: string, alphabet: string): string {
    const cleanStr = sourceText.replace(/\s+/g, '')
    const chars = Array.from(cleanStr)

    const alphabetSet = new Set(Array.from(alphabet))
    for (const char of chars) {
        if (!alphabetSet.has(char)) {
            throw new Error(`Символ '${char}' не входит в заданный алфавит`)
        }
    }
    return chars.join('')
}
