import type { ComponentPropsWithoutRef } from 'react'
import styles from './TextArea.module.css'

interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
    placeholder?: string
}

export const TextArea = ({ placeholder = "", ...props }: TextAreaProps) => {
    return (
        <textarea className={styles.textarea} placeholder={placeholder} {...props} />
    )
}