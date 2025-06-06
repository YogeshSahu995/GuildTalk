import toast from "react-hot-toast"
import { deleteAComment } from "../../../services/comment.service"
import { useState } from "react"
import { useSelector } from "react-redux"

export function CommentOptions({commentDetails, setIsCommentHide}) {
    const [isHidden, setIsHidden] = useState(true)
    const userId = useSelector(state => state.user.userData._id)

    
    const handleDeleteComment = () => {
        Promise.resolve(deleteAComment({ commentId: commentDetails?._id }))
            .then((res) => {
                setIsCommentHide(true)
                if (res?.data?.data) {
                    toast.success("Successfully delete a comment")
                }
            })
    }
    const handleCopyComment = async () => {
        await navigator.clipboard.writeText(commentDetails?.comment)
            .then(() => toast.success("Copied"))
    }

    const options = [
        {
            name: "Delete",
            props: {
                onClick: handleDeleteComment,
            },
            isAccessible: commentDetails?.owner?._id === userId? true: false
        },
        {
            name: "Copy",
            props: {
                onClick: handleCopyComment,
            },
            isAccessible: true
        }
    ]


    return (
        <div
            className="absolute right-2 cursor-pointer text-base"
            onClick={() => setIsHidden(prev => !prev)}
        >
            {isHidden? <i className="ri-more-2-line"></i> : <i class="ri-close-line"></i>}
            <div
                className={`h-fit absolute right-full z-50 py-2 bg-[#000000aa] min-w-[150px] text-white text-center ${isHidden ? "hidden" : "block"} p-1 ml-auto rounded-lg`}
            >
                <ul>
                    {
                        options?.map((option) => (
                            <li
                                className={`hover:bg-[#5c5c5c1e] px-2 font-normal text-sm md:text-base cursor-pointer ${option.isAccessible? "block": "hidden"}`}
                                key={option.name}
                                {...option?.props}
                            >
                                {option.name}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}