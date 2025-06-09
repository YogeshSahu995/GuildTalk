import { useNavigate } from "react-router-dom"
import { timeAgo } from "../../../utils/timeAgoFn"
import { Avatar } from "../../ui"
import { useEffect, useState } from "react"
import { getLatestmessage } from "../../../services/message.service"

export function ChatGroupProfileSingle({ createdAt, group }) {
    const [latestMessage, setLatestMessage] = useState("")
    const time = timeAgo({ createdAt })
    const navigate = useNavigate()

    useEffect(() => {
        const controller = new AbortController()
        Promise.resolve(getLatestmessage({ groupId: group?._id, signal: controller.signal }))
            .then((res) => {
                if (res?.data?.data) {
                    setLatestMessage(res.data.data)
                }
            })
        return () => controller.abort()
    }, [group])

    return (
        <div
            className="w-full flex flex-col min-[350px]:flex-row justify-center min-[350px]:justify-start items-center gap-3 my-2 hover:cursor-pointer hover:bg-[#00000015] dark:hover:bg-[#ffffff11] p-2 rounded-2xl border"
            onClick={() => navigate(`/group/message/to/${group?._id}`)}
        >
            <div>
                <Avatar
                    src={group?.groupAvatar}
                    height="h-[60px] md:h-[70px]"
                    width="w-[60px] md:w-[70px]"
                />
            </div>
            <div className="w-fit">
                <h3 className="font-medium text-lg sm:text-xl text-center min-[350px]:text-start">{group?.groupName}</h3>
                <p className="text-[#171717dc] dark:text-[#ffffffc1] font-normal text-sm">
                    {latestMessage && <input
                        value={`Message: ${latestMessage}`}
                        className="w-[100%] min-[350px]:w-[70%] text-nowrap text-center"
                        disabled
                    />}
                </p>
                <p className="text-sm">
                    <span className="text-nowrap"> {time}  · </span>
                    <span className="text-nowrap">{group?.memberCount} members</span>
                </p>
            </div>
        </div>
    )
}