import { useCryptoStore } from '@/entities/crypto'
import { Button } from '@/shared/ui'

interface ActionButtonProps {
    type: 'encrypt' | 'decrypt'
    disabled: boolean
}

export const ActionButton = (props: ActionButtonProps) => {
    const { handleEncrypt, handleDecrypt } = useCryptoStore()

    return (
        <Button onClick={props.type === 'encrypt' ? handleEncrypt : handleDecrypt} disabled={props.disabled}>
            {props.type === 'encrypt' ? "Зашифровать" : "Дешифровать"}
        </Button>
    )
}