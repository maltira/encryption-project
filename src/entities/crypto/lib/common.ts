// проверяет, что каждый символ текста входит в алфавит
export function isTextInAlphabet(sourceText: string, alphabet: string): boolean {
    if (!alphabet) return true
    for (const char of sourceText) {
        if (!alphabet.includes(char)) {
            return false
        }
    }
    return true
}
