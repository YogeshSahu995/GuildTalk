import toast from "react-hot-toast";
import { addAComment } from "../../../services/comment.service";
import { TextArea } from "..";
import { useState } from "react";
import { useSelector } from "react-redux";

export function PostCommentInput({postId, setNewComment}) {
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState("")
    const owner = useSelector(state => state?.user?.userData)
    
    const handleComment = async() => {
        setLoading(true)
        Promise.resolve(addAComment({data: {comment}, postId}))
        .then((res) => {
            if(res?.data?.data){
                const {comment, createdAt, _id} = res.data.data
                const newcomment = {
                    comment,
                    createdAt,
                    _id,
                    owner
                }
                setNewComment(prev => [...prev, {...newcomment}])
                toast.success("Successfully add a comment")
            }
        })
        .finally(() => {
            setComment("")
            setLoading(false)
        })
    }

    return (
        <>
            <TextArea
                placholder="Add a comment..."
                onInput={(e) => setComment(e.target.value)}
                value={comment}
            />
            <i 
                className={`ri-send-plane-fill text-2xl ${loading? "cursor-wait": "cursor-pointer"} ${comment?.trim() ? "text-[#aa63fc] dark:text-[#ff8201]": "text-[#000] dark:text-[#fff]"}`}
                onClick={handleComment}>
            </i>
        </>
    )
}