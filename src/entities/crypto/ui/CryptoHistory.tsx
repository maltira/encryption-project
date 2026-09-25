import { useCryptoStore } from "../model/store"
import styles from "./CryptoHistory.module.css"

export const CryptoHistory = () => {
    const { history } = useCryptoStore()

    if (history.length === 0) {
        return (
            <p className={styles.emptyHistory}>История операций пуста</p>
        )
    }

    const isExceedLength = (item: number | string): boolean => {
        return String(item).length > 32
    }

    return (
        <div className={styles.history}>
            {history.map((item, i) => (
                <div key={i} className={styles.historyItem}>
                    <p><span>[{item.timestamp}]</span> {item.method} ({item.actionType})</p>
                    <p><span>Вход:</span> {item.input.slice(0, 32)}{isExceedLength(item.input) && "..."}</p>
                    <p><span>Выход:</span> {item.output.slice(0, 32)}{isExceedLength(item.output) && "..."}</p>
                    <p><span>Ключ:</span> {String(item.key).slice(0, 32)}{isExceedLength(item.key) && "..."}</p>
                </div>
            ))}
        </div>
    )

}