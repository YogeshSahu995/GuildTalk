import { useNavigate } from "react-router-dom"
import { Options } from "."
import { useState } from "react"

export function Post({ post, isCurrentUser }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const navigate = useNavigate()

    const handleOptionClick = (e) => {
        e.stopPropagation()
        setIsOpen(prev => !prev)
    }

    return (
        <div
            className={`${isDeleted ? "hidden" : "relative"} h-full w-full bg-[#f1e8ff] dark:bg-[#3a6d8c58] cursor-pointer rounded-2xl`}
            onClick={() => navigate(`/post/${post?._id}`)}
        >
            {isCurrentUser && (
                <>
                    <div
                        className="absolute right-0.5 top-0.5 sm:right-1 sm:top-1 md:right-2 md:top-2 p-0.5 sm:p-1 md:p-2 z-30 sm:text-sm md:text-lg text-white"
                        onClick={handleOptionClick}
                    >
                        <i className={`${isOpen ? "ri-close-fill" : "ri-more-2-line"}`} ></i>
                    </div>
                    <Options
                        postId={post?._id}
                        isOpen={isOpen}
                        setIsDeleted={setIsDeleted}
                    />
                </>
            )}
            <img
                src={post?.image}
                className="h-full w-full object-cover object-center brightness-100 hover:brightness-75 duration-200 rounded-2xl drop-shadow-xl mx-auto"
            />
        </div>
    )
}