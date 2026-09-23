import { useCryptoStore } from "../model/store"
import styles from "./CryptoHistory.module.css"

export const CryptoHistory = () => {
    const { history } = useCryptoStore()

    if (history.length === 0) {
        return (
            <p className={styles.emptyHistory}>История операций пуста</p>
        )
    }

    return (
        <div className={styles.history}>
            {history.map((item) => (
                <div className={styles.historyItem}>
                    <p><span>[{item.timestamp}]</span> {item.method} ({item.actionType})</p>
                    <p><span>Вход:</span> {item.input}</p>
                    <p><span>Выход:</span> {item.output}</p>
                </div>
            ))}
        </div>
    )

}