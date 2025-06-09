import { useEffect, useState } from "react"
import { getAllMembersOfGroup } from "../../../../services/group.service"
import { BigLoader } from "../../../ui"
import { GroupSingleProfile } from "./../GroupSingleProfile"
import { useOutletContext } from "react-router-dom"

export function AllMembers() {
    const { groupId, adminId, CurrentUserAdmin } = useOutletContext()
    const [allMembers, setAllMembers] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const controller = new AbortController()
        Promise.resolve(getAllMembersOfGroup({ groupId, signal: controller.signal }))
            .then((res) => {
                if (res?.data?.data?.members) {
                    setAllMembers(res.data.data.members)
                }
            })
            .finally(() => {
                setLoading(false)
            })
        return () => controller.abort()
    }, [groupId])

    if (loading) return <BigLoader />
    return (
        <ul>
            {allMembers?.map((profile) => (
                <li key={profile?._id}>
                    <GroupSingleProfile
                        profile={profile}
                        isLeader={profile?._id === adminId ? true : false}
                        CurrentUserAdmin={CurrentUserAdmin}
                        groupId={groupId}
                        type="member"
                    />
                </li>
            ))}
        </ul>
    )
}