import { useEffect, useState } from "react"
import { isFollowed } from "../../../services/follow.service"
import { Avatar, Loader } from "../../ui"
import { ToggleFollowBtn } from "./ToggleFollowBtn"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export function SingleProfile({ profile }) {
    const [isFollowing, setIsFollowing] = useState(false)
    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const currentUserName = useSelector(state => state?.user?.userData?.username)
    const navigate = useNavigate()

    useEffect(() => {
        if(currentUserName !== profile?.username){
            setIsCurrentUser(false)
        }
        else{
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
    }, [profile?._id])

    return (
        <div className="w-auto h-fit p-2 m-1 flex flex-col min-[350px]:flex-row justify-between items-center hover:bg-[#00000009] border-b sm:border-none dark:hover:bg-[#ffffff0f] hover:border-b hover:border-[#00000066] dark:border-[#ffffff86] duration-200 rounded-2xl">
            <div className="w-fit flex flex-col min-[350px]:flex-row items-center gap-2 min-[400px]:gap-4 font-semibold text-lg md:text-xl cursor-pointer" onClick={() => navigate(`/profile/${profile?.username}`)}>
                <Avatar
                    src={profile?.avatar}
                    alt="User Avatar"
                />
                <h3>{profile?.username}</h3>
            </div>
            {
                loading ? <Loader /> :
                    <ToggleFollowBtn
                        isFollowing={isFollowing}
                        setIsFollowing={setIsFollowing}
                        userId={profile?._id}
                        isCurrentUser={isCurrentUser}
                    />
            }
        </div>
    )
}