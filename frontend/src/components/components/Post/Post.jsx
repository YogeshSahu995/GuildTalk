import { useEffect, useState } from "react"
import { getPostDetails } from "../../../services/post.service"
import { Avatar, BigLoader, PostCommentInput, PostInfo } from "../../ui"
import { timeAgo } from "../../../utils/timeAgoFn"
import { PostComment } from "./PostComment"

export function Post({ postId }) {
    const [newComment, setNewComment] = useState([])
    const [loading, setLoading] = useState(false)
    const [postDetails, setPostDetails] = useState([])

    useEffect(() => {
        setLoading(true)
        Promise
            .resolve(getPostDetails({ postId }))
            .then(res => {
                setPostDetails(res?.data?.data)
            })
            .finally(setLoading(false))
    }, [postId])

    if (loading) return <BigLoader />

    const { image, _id, owner, createdAt, isLiked, likeCount, commentCount, caption } = postDetails
    const passedTime = timeAgo({ createdAt })
    const date = new Date(createdAt).toLocaleDateString()

    return (
        <div className="h-full w-full grid grid-rows-2 md:grid-cols-2 py-2 gap-2 md:overflow-hidden">
            <section>
                <img
                    src={image}
                    className="h-full aspect-square mx-auto md:h-[80vh] md:aspect-square object-cover object-center rounded-xl"
                />

            </section>
            <section>
                <div className="flex flex-col gap-1">
                    <section className="border-b border-[#26262660] dark:border-[#c5c5c564] mb-2">
                        <PostInfo
                            commentCount={commentCount}
                            likeCount={likeCount}
                            isLiked={isLiked}
                            postId={postId}
                            date={date}
                        />
                    </section>
                    <section className="flex items-center gap-2">
                        <PostCommentInput 
                            postId={postId} 
                            setNewComment={setNewComment}
                        />
                    </section>
                    
                    <section className="relative h-[30dvh] md:h-[60dvh] px-2 py-4 border-b border-[#26262660] dark:border-[#c5c5c564] bg-[#f1e8ff] dark:bg-[#3a6d8c39] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#aa63fc] dark:scrollbar-thumb-[#ff8201]  scrollbar-track-[#25252529] dark:scrollbar-track-[#e0e0e029] scroll-smooth">
                        {/* usercaption */}
                        <div className="flex flex-row items-center gap-2 pb-2 border-b shadow-xl">
                            <Avatar
                                src={owner?.avatar || null}
                                height="h-[40px] sm:h-[45px]"
                                width="w-[40px] sm:w-[45px]"
                            />
                            <div className="text-base md:text-lg">
                                <p className="font-semibold">
                                    {owner?.username}
                                    <span className="ml-2 font-normal">{caption}</span>
                                </p>
                                <p className="text-sm">{passedTime}</p>
                            </div>
                        </div>
                        <PostComment 
                            postId={postId} 
                            newComments={newComment} 
                        />
                    </section>
                    
                </div>
            </section>
        </div>
    )
}