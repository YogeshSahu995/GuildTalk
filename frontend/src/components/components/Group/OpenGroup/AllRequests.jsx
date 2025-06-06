import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { getAllRequestsOfGroup } from "../../../../services/group.service"
import { BigLoader, EmptyPage } from "../../../ui"
import { GroupSingleProfile } from ".."

export function AllRequests() {
    const { groupId, adminId, CurrentUserAdmin } = useOutletContext()
    const [loading, setLoading] = useState(false)
    const [allRequest, setAllRequest] = useState([])

    useEffect(() => {
        setLoading(true)
        Promise.resolve(getAllRequestsOfGroup({ groupId }))
            .then((res) => {
                if (res?.data?.data?.requests) {
                    setAllRequest(res.data.data.requests)
                }
            })
            .finally(() => setLoading(false))
    }, [groupId])

    if (loading) return <BigLoader />
    return (
        <ul>
            {allRequest?.map((profile) => (
                <li
                    key={profile._id}
                    id={profile._id}
                >
                    <GroupSingleProfile
                        groupId={groupId}
                        profile={profile}
                        isLeader={profile?._id === adminId ? true : false}
                        CurrentUserAdmin={CurrentUserAdmin}
                        type="request"
                    />
                </li>
            ))}
            {allRequest.length === 0 && (
                <EmptyPage
                    heading="No Requests Found"
                    firstMessage="There are currently no pending requests."
                />
            )}
        </ul>
    )
}