import { useEffect, useState } from "react"
import { isFollowed } from "../../../services/follow.service"
import { Avatar, Button, Loader } from "../../ui"
import { ToggleFollowBtn } from "../Profile"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RemoveUserBtn } from "./GroupButtons/RemoveUserBtn"
import { AcceptBtn } from "./GroupButtons/AcceptBtn"
import { RejectBtn } from "./GroupButtons/RejectBtn"

export function GroupSingleProfile({
    profile,
    isLeader = false,
    CurrentUserAdmin = false,
    groupId,
    type
}) {
    const [isFollowing, setIsFollowing] = useState(false)
    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isDisappear, setIsDisapper] = useState(false)
    const currentUserName = useSelector(state => state?.user?.userData?.username)
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUserName !== profile?.username) {
            setIsCurrentUser(false)
        }
        else {
            setIsCurrentUser(true)
        }
    }, [currentUserName, profile?.username])

    useEffect(() => {
        setLoading(true)
        Promise.resolve(isFollowed({ profileId: profile?._id }))
            .then((res) => {
                if (res?.data?.data) {
                    setIsFollowing(res.data.data)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [profile?._id, type])

    return (
        <div className={`w-auto h-fit p-2 m-1 flex flex-col sm:flex-row justify-between items-center gap-2 ${isDisappear && "hidden"} border-b sm:border-none 
            ${isLeader ? "bg-[#ffe10016] dark:bg-[#ffdd861d]" : "hover:bg-[#00000009] dark:hover:bg-[#ffffff0f]"} 
            ${isLeader ? "border-b border-amber-500 dark:border-amber-300" : "hover:border-b border-[#00000066] dark:border-[#ffffff86]"} 
            duration-200 rounded-2xl`}
        >
            <div
                className="w-fit flex flex-row items-center gap-4 text-lg sm:text-xl cursor-pointer"
                onClick={() => navigate(`/profile/${profile?.username}`)}
            >
                <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4">
                    <Avatar
                        src={profile?.avatar}
                        alt="User Avatar"
                        isOnline={profile?.isOnline}
                    />
                    <div className="flex items-center gap-2">
                        <div>
                            {isLeader ?
                                <i className="ri-vip-crown-fill text-amber-500 text:bg-amber-300"></i> :
                                <i className="ri-user-fill text-[#00000066] dark:text-[#ffffff86]"></i>
                            }
                        </div>
                        <h3>{profile?.username}</h3>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                {!loading && type == "member" && <ToggleFollowBtn
                    isFollowing={isFollowing}
                    setIsFollowing={setIsFollowing}
                    userId={profile?._id}
                    isCurrentUser={isCurrentUser}
                />}
                {CurrentUserAdmin && !isLeader && type === "member" &&
                    <RemoveUserBtn
                        groupId={groupId}
                        memberId={profile?._id}
                        setIsDisapper={setIsDisapper}
                    />
                }
                {CurrentUserAdmin && type === "request" &&
                    <div className="flex gap-2">
                        <AcceptBtn
                            groupId={groupId}
                            memberId={profile?._id}
                            setIsDisapper={setIsDisapper}
                        />
                        <RejectBtn
                            groupId={groupId}
                            memberId={profile?._id}
                            setIsDisapper={setIsDisapper}
                        />
                    </div>
                }

            </div>
        </div>
    )
}