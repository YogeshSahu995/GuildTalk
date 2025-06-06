import React, { useEffect, useState } from "react"
import { saveTheMessage, saveTheGroupMessage } from "../../../services/message.service";
import { useSelector } from "react-redux";
import { ReceivedMessage, SendedMessage, TextArea } from "../../ui";
import { socket } from "../../../socket";


export const ChatInput = React.memo(({
    chatLayData,
    setChatLayData,
    setNewMessages,
    anotherUserId = "",
    group_Id = "",
    type = "person"
}) => {
    const [loading, setLoading] = useState(false)
    const currentUserId = useSelector(state => state.user?.userData?._id)

    const messageDetails = {
        senderId: currentUserId,
        receiverId: anotherUserId,
        message: chatLayData.message?.trim()
    }

    // handle received message
    useEffect(() => {
        const handleReceiveMessage = ({ senderId, senderUsername, groupId, message, messageType }) => {
            // for Single User
            if (senderId === anotherUserId && type === messageType) { //type: person
                setNewMessages(prev => [...prev, <ReceivedMessage message={message} />])
            }

            //for Group 
            if (senderId !== currentUserId && groupId == group_Id && type === messageType) { //type: group
                setNewMessages(prev => (
                    [...prev, <ReceivedMessage message={message} senderUsername={senderUsername} />]
                ))
            }
        }

        socket.on("receiveMessage", handleReceiveMessage) // this is an listener 

        return () => {
            socket.off("receiveMessage", handleReceiveMessage) // remove the listener
        }
    }, [socket])

    //handle sended message
    const sendMessage = (e) => {
        setLoading(true)
        // socket.emit('message', messageDetails); handle this in an api
        if (type === "person") {
            Promise.resolve(saveTheMessage({
                messageType: type,
                senderId: currentUserId,
                receiverId: anotherUserId,
                message: chatLayData.message?.trim()
            }))
                .then(() => {
                    setNewMessages(prev => [...prev, <SendedMessage message={chatLayData.message} />])
                    setChatLayData(prev => ({
                        ...prev,
                        message: ""
                    }))
                })
                .finally(() => setLoading(false))
        }

        if (type === "group") {
            Promise.resolve(saveTheGroupMessage({
                messageType: type,
                senderId: currentUserId,
                groupId: group_Id,
                message: chatLayData.message?.trim()
            }))
                .then((res) => {
                    if (res.data.data) {
                        setNewMessages(prev => [...prev, <SendedMessage message={chatLayData.message} />])
                        setChatLayData(prev => ({
                            ...prev,
                            message: ""
                        }))
                    }
                })
                .finally(() => setLoading(false))
        }
    }

    return (
        <div className="h-[10%] w-full flex gap-2 items-center">
            <TextArea
                value={chatLayData.message}
                placeholder="Type Message here..."
                onChange={(e) => setChatLayData(prev => ({ ...prev, message: e.target.value }))}
                border="border border-[#000] dark:border-[#fff] outline-none"
            />
            <i
                className={`ri-send-plane-fill text-xl md:text-2xl ${loading ? "cursor-wait" : "cursor-pointer"} ${chatLayData.message?.trim() ? "text-[#aa63fc] dark:text-[#ff8201]" : "text-[#000] dark:text-[#fff]"}`}
                onClick={
                    sendMessage
                }>
            </i>
        </div>
    )
})