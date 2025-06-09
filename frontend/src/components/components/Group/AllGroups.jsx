import { useEffect, useState } from "react"
import { getAllGroupsOfUser } from "../../../services/group.service"
import { BigLoader } from "../../ui"
import { SingleGroup } from "."

export function AllGroup() {
    const [allGroup, setAllGroup] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const controller = new AbortController()
        Promise.resolve(getAllGroupsOfUser({signal: controller.signal}))
            .then((res) => {
                if (res?.data?.data?.groups) {
                    setAllGroup(res.data.data.groups)
                }
            })
            .finally(() => setLoading(false))
            
        return () => controller.abort()
    }, [])

    if (loading) return <BigLoader />
    return (
        <ul>
            {allGroup?.map((group) => (
                <li key={group?._id} className="-z-50">
                    <SingleGroup group={group} />
                </li>
            ))}
        </ul>
    )
}
