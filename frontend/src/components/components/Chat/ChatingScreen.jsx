import { ChatLayout } from "./index";
import { useParams } from "react-router-dom";
import { ChatHeader } from "./ChatHeader";
import { useEffect, useState     } from "react";
import { getUserDetailsById } from "../../../services/user.service";

export function ChatingScreen() {
    const [username, setUsername] = useState("")
    const { anotherUserId } = useParams()
    useEffect(() => {
        const controller = new AbortController()
        Promise.resolve(getUserDetailsById({anotherUserId, signal}))
        .then(res => setUsername(res?.data?.data?.username))

        return () => controller.abort()
    }, [anotherUserId])

    return (
        <div className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-[90%] w-[95%] sm:w-[70%] md:w-[60%] lg:w-1/2 flex flex-col justify-between px-2 bg-[#0000000f] dark:bg-[#ffffff0c] rounded-2xl shadow-lg'> 
            <ChatHeader 
                anotherUserId={anotherUserId} 
                anotherUsername = {username}
                type = "person"
            />
            <ChatLayout 
                anotherUserId={anotherUserId} 
                type = "person"
            />
        </div>
    )
}
