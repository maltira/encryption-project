import type { ComponentPropsWithoutRef } from 'react'
import styles from './Select.module.css'

interface SelectProps extends ComponentPropsWithoutRef<'select'> {
    options: readonly string[]
}

export const Select = ({ options, ...rest }: SelectProps) => {
    return (
        <select className={styles.select} {...rest}>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}