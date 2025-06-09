import { useEffect, useState } from "react"
import { toggleLike } from "../../../services/like.service"

export function PostInfo({ likeCount, commentCount, isLiked, postId, date }) {
    const [loading, setLoading] = useState(false)
    const [liked, setLiked] = useState(isLiked)
    const [likes, setLikes] = useState(likeCount)
    const [comments, setComments] = useState(commentCount)

    useEffect(() => {
        setLiked(isLiked);
        setLikes(likeCount);
        setComments(commentCount);
    }, [isLiked, likeCount, commentCount]);

    const handleLike = async () => {
        if (!loading) {
            setLoading(true)
            const controller = new AbortController()
            Promise.resolve(toggleLike({ postId, signal: controller.signal }))
                .then(res => {
                    if (res?.data?.data) {
                        setLiked(true)
                        setLikes(prev => ++prev)
                    }
                    else {
                        setLiked(false)
                        setLikes(prev => --prev)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
            return () => controller.abort()
        }
    }
    return (
        <>
            <div className="flex gap-4 text-2xl">
                <div className="flex flex-col">
                    <i
                        className={`${liked ? `ri-heart-fill text-[#aa63fc] dark:text-[#ff8201]` : `ri-heart-line`} ${loading ? "cursor-wait" : "cursor-pointer"}  duration-200`}
                        onClick={handleLike}
                    ></i>
                    <p className="text-sm sm:text-base md:text-lg">{likes} likes</p>
                </div>
                <div className="flex flex-col">
                    <i className="ri-chat-3-line"></i>
                    <p className="text-sm sm:text-base md:text-lg">{comments} comments</p>
                </div>
            </div>
            <p className="text-[#26262686] dark:text-[#c5c5c595] text-xs m-0.5">{date}</p>
        </>
    )
}