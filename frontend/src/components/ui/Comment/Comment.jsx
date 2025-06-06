import { useNavigate } from "react-router-dom"
import { Avatar } from ".."
import { timeAgo } from "../../../utils/timeAgoFn"
import { CommentOptions } from "."
import { useState } from "react"

export function Comment({ commentDetails }) {
    const [isCommentHide, setIsCommentHide] = useState(false)
    const { comment, owner, createdAt } = commentDetails
    const navigate = useNavigate()
    const time = timeAgo({ createdAt })
    return (
        <div className={`${isCommentHide? "hidden":"relative"} flex flex-wrap flex-col items-start md:font-semibold text-base md:text-xl gap-2 py-2 border-b shadow-xl  `}>
            <div className="flex flex-wrap flex-col md:flex-row md:items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/profile/${owner?.username}`)}>
                    <Avatar
                        src={owner?.avatar || null}
                        alt="avatar"
                        height="h-[40px] sm:h-[45px]"
                        width="w-[40px] sm:w-[45px]"
                    />
                    <div>
                        <p>{owner?.username}</p>
                    </div>
                </div>
                <p className="ml-2 w-auto overflow-x-auto font-normal text-sm italic">{" "+comment}</p>
            </div>
            <p className="text-xs font-normal">{time}</p>
            <CommentOptions 
                commentDetails={commentDetails} 
                setIsCommentHide = {setIsCommentHide}
            />
        </div>
    )
}