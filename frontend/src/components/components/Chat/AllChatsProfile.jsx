import { useEffect, useState } from "react"
import { getAllUserAndGroup } from "../../../services/message.service"
import { BigLoader, EmptyPage } from "../../ui"
import { ChatProfileSingle } from "./ChatProfileSingle"
import { ChatGroupProfileSingle } from "./ChatGroupProfileSingle"

export function AllChatsProfile() {
    const [loading, setLoading] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [allGroups, setAllGroups] = useState([])

    useEffect(() => {
        setLoading(true)
        const controller = new AbortController()
        Promise.resolve(getAllUserAndGroup({signal: controller.signal}))
            .then(res => {
                if (res?.data?.data?.userProfiles) {
                    setAllUsers(res.data.data.userProfiles)
                }
                if (res?.data?.data?.groups) {
                    setAllGroups(res.data.data.groups)
                }
            })
            .finally(setLoading(false))
        return () => controller.abort()
    }, [])

    if (loading) return <BigLoader />
    if (allGroups.length == 0 && allUsers.length == 0 && !loading) {
        return <EmptyPage
            heading="💬 No Chats Yet"
            firstMessage="Your conversations will appear here once you start chatting."
            secondMessage="Search for a profile and say hello!"
        />
    }
    return (
        <div className="h-full">
            <h2 className="text-2xl font-semibold mb-4">Messages</h2>
            <div className="h-[90%] grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-1">
                {
                    allUsers.length > 0 &&
                    <section className="lg:max-h-full overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#aa63fc] dark:scrollbar-thumb-[#ff8201]  scrollbar-track-[#25252529] dark:scrollbar-track-[#e0e0e029] scroll-smooth border px-2 border-[#00000095] dark:border-[#ffffff80]">
                        <h3 className="text-xl pb-2 sticky top-0 bg-[#E5D9F2] dark:bg-[#001F3F] z-40">Users</h3>
                        {allUsers?.map(({ latestMessage, createdAt, profile }) => (
                            <div key={profile?._id}>
                                <ChatProfileSingle
                                    createdAt={createdAt}
                                    latestMessage={latestMessage}
                                    profile={profile}
                                />
                            </div>
                        ))}
                    </section>
                }
                {
                    allGroups.length > 0 &&
                    <section className="lg:max-h-full overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#aa63fc] dark:scrollbar-thumb-[#ff8201]  scrollbar-track-[#25252529] dark:scrollbar-track-[#e0e0e029] scroll-smooth border px-2 border-[#00000095] dark:border-[#ffffff80]">
                        <h3 className="text-xl pb-2 sticky top-0 bg-[#E5D9F2] dark:bg-[#001F3F] z-40">Groups</h3>
                        {
                            allGroups?.map(({ createdAt, group }) => (
                                <div key={group?._id}>
                                    <ChatGroupProfileSingle
                                        createdAt={createdAt}
                                        group={group}
                                    />
                                </div>
                            ))
                        }
                    </section>
                }
            </div>
        </div>
    )
}