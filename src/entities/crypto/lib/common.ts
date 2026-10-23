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
