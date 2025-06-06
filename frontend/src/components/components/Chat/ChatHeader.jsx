import { useEffect, useState } from "react";
import { Avatar } from "../../ui";
import { getUserDetailsById } from "../../../services/user.service";
import { timeAgo } from "../../../utils/timeAgoFn";
import { getGroupById } from "../../../services/group.service";
import { useNavigate } from "react-router-dom";

export function ChatHeader({ 
    anotherUsername,
    anotherUserId, 
    type = "person", groupId }) {
    const [user, setUser] = useState({})
    const [group, setGroup] = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        if (type == "person") {
            Promise.resolve(getUserDetailsById({ anotherUserId }))
                .then((res) => {
                    if (res?.data?.data) {
                        setUser(res.data.data)
                    }
                })
                .finally(() => setLoading(false))
        }
        else {
            Promise.resolve(getGroupById({ groupId }))
                .then((res) => {
                    if (res?.data?.data) {
                        setGroup(res.data.data)
                    }
                })
                .finally(() => setLoading(false))
        }
    }, [anotherUserId, groupId])

    if (loading) return

    return (
        <section 
            className="h-[15%] flex flex-row items-center gap-2 border-b border-b-[#00000070] dark:border-b-[#ffffffa5] p-1 shadow-xl cursor-pointer"
            onClick={() => navigate( type === "group" ? `${`/group/${groupId}/members`}`: `${`/profile/${anotherUsername}`}`)}
        >
            <div>
                <Avatar
                    src={type === "person" ? user?.avatar : group?.groupAvatar}
                    isOnline={user?.isOnline ? true : false}
                />
            </div>
            <div>
                <div className="text-lg md:text-xl">
                    <p>{type === "person" ? user?.username : group?.groupName}</p>
                </div>
                <div className="text-sm md:text-base">
                    {type === "person" && (user?.isOnline ? 
                    <span>Active now</span> : 
                    <span>last seen at {timeAgo({ createdAt: user?.updatedAt })}</span>)}
                </div>
            </div>
        </section>
    )
}