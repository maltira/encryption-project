import type { ComponentPropsWithoutRef } from 'react'
import styles from './Button.module.css'

type ButtonProps = ComponentPropsWithoutRef<'button'>

export const Button = ({ children, className, ...props }: ButtonProps) => {
    return (
        <button className={`${styles.button} ${className ?? ''}`.trim()} {...props}>
            {children}
        </button>
    )
}