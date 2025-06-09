import { getAPostComment } from "../../../services/comment.service"
import { Loader, Comment } from "../../ui"
import { useState, useEffect } from "react"

export function PostComment({ postId, newComments = [] }) {
    const [allComments, setAllComments] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const controller = new AbortController()
        Promise
            .resolve(getAPostComment({ postId, signal: controller.signal }))
            .then(res => {
                if (res?.data?.data) {
                    setAllComments(res.data.data)
                }
            })
            .finally(setLoading(false))

        return () => controller.abort()
    }, [postId])

    return (
        <>
            {
                (newComments?.length == 0 && allComments?.length == 0) &&
                    (
                        <div className="w-full text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">No comments yet.</h3>
                            <p className="md:text-lg text-[#2227] dark:text-[#a0a0a0a1] ">Start the conversation.</p>
                        </div>
                    ) 
                }
                {
                    newComments?.map((comment) => (
                        <div key={comment?._id}>
                            <Comment commentDetails={comment} />
                        </div>
                    ))
                }
                {

                    allComments?.map((comment) => (
                        <div key={comment?._id}>
                            <Comment commentDetails={comment} />
                        </div>
                    ))
                }
            {loading && <Loader className="mx-auto" />}
        </>
    )
}