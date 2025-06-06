import { useNavigate } from "react-router-dom"
import { Avatar, Button } from "../../ui"
import { ToggleFollowBtn } from "./index"
import { useState } from "react"

export function ProfileHeader({profileData, isCurrentUser}){
    const {_id, avatar, username, email, isFollowed, followersCount, followingCount, postCount} = profileData
    const [isFollowing, setIsFollowing] = useState(isFollowed)

    const navigate = useNavigate()

    return(
        <div className="h-[20%] w-full flex flex-wrap gap-2 md:gap-4 p-4 bg-[#f1e8ff] dark:bg-[#3a6d8c58] shadow-2xl rounded-2xl">
            <section className="w-fit mx-auto md:mx-0">
                <Avatar 
                    src= {avatar}
                    alt="avatar"
                    height="h-[23vw] min-[420px]:h-[20vw] sm:h-[90px] md:h-[120px]"
                    width="w-[23vw] min-[420px]:w-[20vw] sm:w-[90px] md:w-[120px]"
                    className="mx-auto"
                />
            </section>
            <section className="w-auto mx-auto md:mx-0 flex flex-col gap-1 md:gap-2">
                <section className="h-fit w-fit flex flex-wrap justify-center items-center gap-2 my-2 md:my-0 md:gap-8">
                    <p className="text-xl lg:text-2xl font-semibold">{username}</p>
                    <div className="flex gap-2">
                        <ToggleFollowBtn 
                                isCurrentUser={isCurrentUser} 
                                isFollowing={isFollowing} 
                                setIsFollowing = {setIsFollowing}
                                userId={_id} 
                        />
                        {
                            !isCurrentUser && (
                                <Button 
                                    value="Message"
                                    icon={<i className="ri-chat-3-line ml-1"></i>}
                                    backgroundColor="bg-[#9282a4] dark:bg-[#ff800169] hover:bg-[#aa63fcd2] dark:hover:bg-[#ff8001d2]"
                                    onClick={() => navigate(`/message/to/${_id}`)} //message to person
                                />  
                            )
                        }
                    </div>
                </section>
                <section className="w-full md:w-fit text-center md:text-start text-sm sm:text-base">
                    <p className=" md:text-lg text-[#000000cb] dark:text-[#ffffffa2]">{email}</p>
                </section>
                <section className="h-fit w-full md:w-fit flex justify-between md:justify-center items-center gap-2 md:gap-8 text-sm sm:text-base">
                    <p>
                        {postCount} 
                        <span className="text-[#000000cb] dark:text-[#ffffffa2] ml-1">posts</span>
                    </p>
                    <p 
                        onClick={() => navigate('./followers')} 
                        className="cursor-pointer"
                    >
                        {followersCount} 
                        <span className="text-[#000000cb] dark:text-[#ffffffa2] ml-1">followers</span>
                    </p>
                    <p 
                        onClick={() => navigate("./following")} 
                        className="cursor-pointer"
                    >
                        {followingCount} 
                        <span className="text-[#000000cb] dark:text-[#ffffffa2] ml-1">following</span>
                    </p>
                </section>
            </section>
        </div>
    )
}