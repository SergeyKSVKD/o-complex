import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY
            
            setScrollPosition(position)
        };
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return scrollPosition
}
