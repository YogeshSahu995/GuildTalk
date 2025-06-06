import { useNavigate } from "react-router-dom"
import { timeAgo } from "../../../utils/timeAgoFn"
import {Avatar} from "../../ui"

export function ChatProfileSingle({latestMessage, createdAt, profile}) {
    const time = timeAgo({createdAt})
    const navigate = useNavigate()

    return (
        <div 
            className="w-full flex flex-col min-[350px]:flex-row justify-center min-[350px]:justify-start items-center gap-3 my-2 hover:cursor-pointer hover:bg-[#00000015] dark:hover:bg-[#ffffff11] p-2 rounded-2xl border"
            onClick={() => navigate(`/message/to/${profile?._id}`)}
        >
            <div>
                <Avatar 
                    src={profile?.avatar}
                    height="h-[60px] md:h-[70px]"
                    width="w-[60px] md:w-[70px]"
                    isOnline = {profile?.isOnline}
                />
                
            </div>
            <div className="w-fit text-center min-[350px]:text-start text-sm">
                <h3 className="font-medium text-lg sm:text-xl">{profile?.username}</h3>
                <p className="text-[#171717dc] dark:text-[#ffffffc1] font-normal">
                    <input 
                        value={`Message: ${latestMessage}`} 
                        className="w-[100%] min-[350px]:w-[50%] text-nowrap text-center"
                        disabled 
                    />
                </p>
                <p>
                    {time}
                </p>
            </div>
        </div>
    )
}