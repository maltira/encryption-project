
// удаляет из текста символы, не входящие в алфавит
export function filterByAlphabet(sourceText: string, alphabet: string): string {
    if (!alphabet) return sourceText
    const alphabetSet = new Set(Array.from(alphabet))
    let res = ''
    for (const char of sourceText) {
        if (alphabetSet.has(char)) {
            res += char
        }
    }
    return res
}

// проверяет, что каждый символ текста входит в алфавит
export function isTextInAlphabet(sourceText: string, alphabet: string): boolean {
    if (!alphabet) return true
    const alphabetSet = new Set(Array.from(alphabet))
    for (const char of sourceText) {
        if (!alphabetSet.has(char)) {
            return false
        }
    }
    return true
}
