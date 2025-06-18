import { RefObject, useEffect, useMemo, useState } from "react"

export function useOnScreen(ref: RefObject<HTMLDivElement | null>) {
    const [isIntersecting, setIntersecting] = useState(true)

    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
    ), [ref])


    useEffect(() => {
        if (!ref.current) return;
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return isIntersecting
}