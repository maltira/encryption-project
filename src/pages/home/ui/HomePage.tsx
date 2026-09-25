import { CryptoForm } from '@/widgets/crypto-form'

export const HomePage = () => {
    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', margin: "100px 0 32px 0" }}>
            <CryptoForm />
        </main>
    )
}