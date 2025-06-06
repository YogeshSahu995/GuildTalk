import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ReceivedMessage, SendedMessage } from "../../ui/Chat/index.js"
import { getAllMessage, getAllMessageOfGroup } from "../../../services/message.service.js"
import { Loader } from "../../ui"
import { ChatInput } from "./index.js"
import { useSelector } from "react-redux"
import { checkUserExistInGroup } from "../../../services/group.service.js"

export function ChatLayout({
    anotherUserId = "",
    groupId = "",
    type = "person"
}) {
    const [chatLayData, setChatLayData] = useState({
        loading: false,
        page: 1,
        limit: 20,
        allMessages: [],
        hasNextPage: false,
        message: ""
    })
    const [newMessages, setNewMessages] = useState([])
    const [isExistInGroup, setIsExistInGroup] = useState(true)
    const chats = useRef()
    const currentUserData = useSelector(state => state?.user?.userData)
    let lastDate = null; // for not re-render the page make a simple variable

    //initial bottom scroll
    useEffect(() => {
        setTimeout(() => {
            chats.current?.scrollTo({
                top: chats?.current?.scrollHeight,
                behaviour: "smooth"
            })
        }, 200);
    }, [chats, newMessages])

    //pagination handle
    useEffect(() => {
        const listenerFn = (e) => {
            if (!chats.current) return
            const { scrollTop } = chats.current

            if (scrollTop < 400 && chatLayData.hasNextPage) {
                setChatLayData(prev => ({ ...prev, page: ++prev.page }))
            }
        }
        const container = chats.current
        setTimeout(() => {
            container.addEventListener("scroll", listenerFn) //todo use of bubbling
        }, 1000)

        return () => {
            container.removeEventListener("scroll", listenerFn)
        }
    }, [chats, chatLayData?.hasNextPage])

    //get previous messages
    useEffect(() => {
        setChatLayData(prev => ({ ...prev, loading: true }))

        if (type === "person") {
            Promise.resolve(getAllMessage({
                limit: chatLayData.limit,
                page: chatLayData.page,
                anotherUserId
            }))
                .then((res) => {
                    if (res?.data?.data?.docs && chatLayData.page === 1) {
                        setChatLayData(prev => (
                            { ...prev, allMessages: [...prev.allMessages, ...res.data.data.docs?.reverse()] }
                        ))
                        setChatLayData(prev => ({ ...prev, hasNextPage: res.data.data.hasNextPage }))
                    }
                    if (res?.data?.data?.docs && chatLayData.page > 1) {
                        setChatLayData(prev => (
                            { ...prev, allMessages: [...res.data.data.docs?.reverse(), ...prev.allMessages] }
                        ))
                        setChatLayData(prev => ({ ...prev, hasNextPage: res.data.data.hasNextPage }))
                    }
                })
                .finally(() => {
                    setChatLayData(prev => ({ ...prev, loading: false }))
                })
        }
        else {
            Promise.resolve(getAllMessageOfGroup({
                groupId,
                page: chatLayData.page,
                limit: chatLayData.limit
            }))
                .then((res) => {
                    if (res?.data?.data?.docs && chatLayData.page === 1) {
                        setChatLayData(prev => (
                            { ...prev, allMessages: [...prev.allMessages, ...res.data.data.docs?.reverse()] }
                        ))
                        setChatLayData(prev => ({ ...prev, hasNextPage: res.data.data.hasNextPage }))
                    }
                    if (res?.data?.data?.docs && chatLayData.page > 1) {
                        setChatLayData(prev => (
                            { ...prev, allMessages: [...res.data.data.docs?.reverse(), ...prev.allMessages] }
                        ))
                        setChatLayData(prev => ({ ...prev, hasNextPage: res.data.data.hasNextPage }))
                    }
                })
                .finally(() => {
                    setChatLayData(prev => ({ ...prev, loading: false }))
                })
        }

    }, [anotherUserId || groupId, chatLayData?.limit, chatLayData?.page])

    //check user exist in group or not
    useEffect(() => {
        if (type === "group" && currentUserData?._id && groupId) {
            Promise.resolve(checkUserExistInGroup({
                groupId,
                userId: currentUserData?._id
            }))
                .then((res) => {
                    if (res?.data?.data) {
                        setIsExistInGroup(res.data.data.isExist)
                    }
                })
        }
    }, [currentUserData, groupId])


    return (
        <section className="h-[85%] w-full flex flex-col justify-start gap-1 pb-2">
            <div
                className="h-[88%] w-full flex flex-col p-2 overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#aa63fc] dark:scrollbar-thumb-[#ff8201]  scrollbar-track-[#25252529] dark:scrollbar-track-[#e0e0e029] scroll-smooth"
                ref={chats}
            >
                {chatLayData.loading && <div className="w-fit mx-auto my-1">
                    <Loader />
                </div>
                }
                {chatLayData.allMessages?.map((messageDetails) => {
                    const currentDate = new Date(messageDetails?.createdAt).toDateString()
                    if (currentDate !== lastDate) {
                        lastDate = currentDate
                        return (
                            <div
                                className="h-fit w-fit text-xs sm:text-sm  mx-auto p-1 m-2 rounded bg-[#000000aa] text-[#fff]"
                                key={currentDate}
                            >
                                {currentDate}
                            </div>
                        )
                    }
                    if (type === "person") {
                        if (messageDetails?.senderId === anotherUserId) {
                            return (<div key={messageDetails?._id}>
                                <ReceivedMessage
                                    id={messageDetails?._id}
                                    message={messageDetails?.message}
                                    time={new Date(messageDetails?.createdAt).toLocaleTimeString()}
                                />
                            </div>)
                        }
                        else {
                            return (<div key={messageDetails?._id}>
                                <SendedMessage
                                    id={messageDetails?._id}
                                    message={messageDetails?.message}
                                    time={new Date(messageDetails?.createdAt).toLocaleTimeString()}
                                />
                            </div>)
                        }
                    }
                    else {
                        if (messageDetails?.senderId === currentUserData?._id) {
                            return (<div key={messageDetails?._id}>
                                <SendedMessage
                                    id={messageDetails?._id}
                                    message={messageDetails?.message}
                                    time={new Date(messageDetails?.createdAt).toLocaleTimeString()}
                                />
                            </div>)
                        }
                        else {
                            return (<div key={messageDetails?._id}>
                                <ReceivedMessage
                                    senderUsername={messageDetails?.senderDetails?.[0]?.username}
                                    message={messageDetails?.message}
                                    time={new Date(messageDetails?.createdAt).toLocaleTimeString()}
                                />
                            </div>)
                        }
                    }
                })}
                {newMessages?.map((message, i) => (
                    <div key={i}>
                        {message}
                    </div>
                ))}
            </div>
            <div className="h-[10%] w-full flex items-center justify-center">
                {
                    !isExistInGroup && type == "group" &&
                    <div className="bg-black text-[#ffffffe2] text-xs sm:text-sm text-center p-2 rounded-2xl mx-auto w-fit">❌ Join the group to send messages</div>
                }
                {isExistInGroup && type === "group" &&
                    <ChatInput
                        anotherUserId={anotherUserId}
                        group_Id={groupId}
                        chatLayData={chatLayData}
                        setChatLayData={setChatLayData}
                        chatContainer={chats.current}
                        setNewMessages={setNewMessages}
                        type={type}
                    />
                }
                {
                    type === "person" &&
                    <ChatInput
                        anotherUserId={anotherUserId}
                        group_Id={groupId}
                        chatLayData={chatLayData}
                        setChatLayData={setChatLayData}
                        chatContainer={chats.current}
                        setNewMessages={setNewMessages}
                        type={type}
                    />
                }

            </div>
        </section>
    )
}