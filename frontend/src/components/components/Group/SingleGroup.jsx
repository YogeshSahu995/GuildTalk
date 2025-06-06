import { useNavigate } from "react-router-dom";
import { Avatar, Button, CoverImage } from "../../ui";
import { AddRequestBtn } from "./GroupButtons/AddRequestBtn";
import { useEffect, useState } from "react";
import { checkIsJoinedTheGroup } from "../../../services/group.service";
import { MessageBtn } from "./GroupButtons";


export function SingleGroup({ group }) {
    const navigate = useNavigate()
    const [isJoind, setIsJoined] = useState(false)

    useEffect(() => {
        Promise.resolve(checkIsJoinedTheGroup({ groupId: group?._id }))
            .then((res) => {
                if (res?.data?.data) {
                    setIsJoined(res.data.data)
                }
            })
    }, [group?._id])

    return (
        <div
            className={
                `relative mb-7 h-[170px] min-[350px]:h-[150px] w-full rounded-2xl text-[#fff] 
                ${isJoind && "cursor-pointer"} 
                ${!group?.groupCoverImage && "bg-[#0000007a] dark:bg-[#ffa25a1f]"}`
            }
            onClick={() => { navigate(`${isJoind ? `/group/${group?._id}` : "."}`) }}
        >
            {group?.groupCoverImage && <CoverImage
                src={group?.groupCoverImage}
                alt="Group CoverImage"
                className="relative brightness-50 mr-auto"
                width="w-[100%]"
            />}
            <div className="absolute top-[50%] -translate-y-[50%] w-full flex flex-col min-[350px]:flex-row gap-2 items-center justify-between z-10 p-2">
                <div className="flex flex-wrap justify-center flex-row items-center gap-2">
                    <Avatar
                        src={group?.groupAvatar}
                        alt="Group Avatar"
                        height="h-[60px] min-[350px]:h-[70px] md:h-[90px]"
                        width="w-[60px] min-[350px]:w-[70px] md:w-[90px]"
                        className="border-2 border-[#fff]"
                    />
                    <div>
                        <h3 className="text-wrap italic text-base min-[350px]:text-lg sm:text-xl md:text-2xl font-semibold">{group?.groupName}</h3>
                        <div className="cursor-pointer" onClick={() => navigate(`/profile/${group?.admin?.username}`)}>
                            👑{group?.admin?.username}
                        </div>
                    </div>
                </div>
                {
                    isJoind ? (<MessageBtn groupId={group?._id} />) : (<AddRequestBtn groupId={group?._id} />)
                }
            </div>
            <div className="absolute top-2 right-4">
                <div>
                    <span><i className="ri-group-fill"></i></span>
                    {group?.memberCount}
                </div>
            </div>
        </div>
    )
}
