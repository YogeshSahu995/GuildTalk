import { useEffect, useState } from "react"

export function useDebounce(query){
    const [searchName, setSearchName] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchName(query)
        }, 200);

        return () => clearTimeout(timeout)
    }, [query])

    return searchName
}