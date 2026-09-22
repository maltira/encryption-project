import { TextArea } from '@/shared/ui'
import { useCryptoStore } from '../model/store'

export const ResultDisplay = () => {
    const { resultText } = useCryptoStore()

    return (
        <TextArea placeholder='Преобразованный текст' disabled value={resultText} />
    )
}