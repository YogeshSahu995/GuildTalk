import { useState } from "react"
import { MessageOption } from "./MessageOptions"

export function SendedMessage({ message, time, id }) {
    const [isHidden, setIsHidden] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    return (
        <div className={`${isDeleted ? "hidden" : "relative"}`}>
            <MessageOption
                isOpen={isOpen}
                messageId={id}
                setIsDeleted={setIsDeleted}
                message = {message}
            />
            <div
                className={`flex flex-wrap items-end gap-1 w-fit wrap-break-word whitespace-normal overflow-visible max-w-[50%] h-fit p-2 mb-2 
                    text-sm sm:text-base rounded-xl bg-[#aa63fc] dark:bg-[#ff8001b0] text-amber-50 ml-auto`}
                onMouseOver={(e) => {
                    setIsHidden(false)
                }}
                onMouseOut={() => setIsHidden(true)}
            >
                {message}
                <i
                    className="text-[#ffffffbc] text-xs ml-auto"
                >{time}</i>
                <div
                    className={`${isHidden && !isOpen ? "hidden" : "block"} hover:cursor-pointer`}
                    onClick={() => {setIsOpen(prev => !prev)}}
                >
                    <i className={`ri-arrow-down-s-line ${isOpen ? "hidden" : "block"}`}></i>
                    <i className={`ri-arrow-up-s-line ${isOpen ? "block" : "hidden"}`}></i>
                </div>
            </div>
        </div>
    )
}