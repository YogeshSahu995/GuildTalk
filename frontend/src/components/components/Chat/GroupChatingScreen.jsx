import { ChatLayout } from "./index";
import { useParams } from "react-router-dom";
import { ChatHeader } from "./ChatHeader";
import { useState } from "react";

export function GroupChatingScreen() {
    const { groupId } = useParams()

    return (
        <div className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-[90%] w-[95%] sm:w-[70%] md:w-[60%] lg:w-1/2 flex flex-col justify-between p-2 bg-[#0000000f] dark:bg-[#ffffff0c] rounded-2xl shadow-lg'> 
            <ChatHeader 
                groupId = {groupId}
                type = "group" 
            />
            <ChatLayout 
                groupId = {groupId}
                type = "group"
            />
        </div>
    )
}
