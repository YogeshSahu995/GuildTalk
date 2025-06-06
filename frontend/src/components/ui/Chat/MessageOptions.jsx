import { deleteAMessage } from "../../../services/message.service"
import toast from "react-hot-toast"

export function MessageOption({ isOpen, messageId, setIsDeleted, message }) {

    const handleDeleteMessage = (e) => {
        e.stopPropagation()
        Promise.resolve(deleteAMessage({ messageId }))
            .then((res) => {
                if (res?.data?.data) {
                    setIsDeleted(true)
                    toast.success("👍 deleted successfully")
                }
            })
    }
    const handleCopyMessage = async(e) => {
        e.stopPropagation()
        await navigator.clipboard.writeText(message)
        .then(() => toast.success("Copied"))
    }

    const options = [
        {
            name: "Delete",
            props: {
                onClick: handleDeleteMessage,
            }
        },
        {
            name: "Copy",
            props: {
                onClick: handleCopyMessage,
            }
        },
    ]

    return (
        <div
            className={`h-fit w-[45%] relative -top-1 right-0  z-50 py-2 text-white bg-[#000000aa] ${isOpen ? "block" : "hidden"} ml-auto rounded-lg text-xs sm:text-sm lg:text-base`}
        >
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