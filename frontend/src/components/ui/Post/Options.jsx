import { deleteAPost } from "../../../services/post.service"
import toast from "react-hot-toast"

export function Options({isOpen, setIsDeleted, postId}){

    const handleDeleteMessage = (e) => {
        e.stopPropagation()
        Promise.resolve(deleteAPost({ postId }))
            .then((res) => {
                if (res?.data?.data) {
                    setIsDeleted(true)
                    toast.success("👍 deleted successfully")
                }
            })
    }

    const options = [
        {
            name: "Delete",
            props: {
                onClick: handleDeleteMessage,
            }
        },
    ]

    return (
        <div className={`h-fit w-[60%] md:w-[45%] absolute top-1 right-1 md:top-3 md:right-3 text-white  z-20 py-2 bg-[#000000aa] ${isOpen ? "block" : "hidden"} text-xs sm:text-sm lg:text-base ml-auto rounded-lg`}>
            <ul>
                {
                    options?.map((option) => (
                        <li
                            className="hover:bg-[#5c5c5c1e] px-2 cursor-pointer"
                            key={option.name}
                            {...option?.props}
                        >
                            {option.name}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}