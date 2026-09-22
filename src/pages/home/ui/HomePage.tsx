import { CryptoForm } from '@/widgets/crypto-form'

export const HomePage = () => {
    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h1>Выберите метод шифрования</h1>
            <CryptoForm />
        </main>
    )
}