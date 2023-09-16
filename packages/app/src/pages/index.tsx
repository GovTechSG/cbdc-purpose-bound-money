import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function HomePage() {
    const router = useRouter()

    // Let's just make the home page redirect to the PBM dashboard 4eva...
    useEffect(() => {
        router.push('/pbm')
    }, [router])

    return null
}
