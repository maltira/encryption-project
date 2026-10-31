import { TextArea } from '@/shared/ui'
import { useCryptoStore } from '../model/store'

interface Props {
    error?: string
}

export const ResultDisplay = ({ error }: Props) => {
    const { resultText } = useCryptoStore()


    return (
        <TextArea placeholder='Преобразованный текст' disabled value={resultText || error} />
    )
}