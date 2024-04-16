'use client'

import { useRouter } from 'next/navigation'
import styles from './product.module.scss'

type Props = {
    params: {
        id: string
    }
}

export default function CasePage({ params: { id } }: Props) {
    const router = useRouter()

    return <div className={styles.card}>
        <p>{id}</p>
        <p>Подробная информация о товаре</p>
    </div>
}