import { useEffect, useState } from "react"
import { getAllPostOfUser } from "../../../services/post.service"
import { Loader, Post, EmptyPage } from "../../ui"
import { paginationHandler } from "../../../utils/paginationHandler"
import { useOutletContext } from "react-router-dom"

export function ProfilePost({ profileId, isCurrentUser }) {
    const {scrollContainer} = useOutletContext()
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [limit, setLimit] = useState(12)
    const [loading, setLoading] = useState(false)
    const [allPost, setAllPost] = useState([])

    useEffect(() => {
        setLoading(true)
        const controller = new AbortController()
        Promise.resolve(getAllPostOfUser({ userId: profileId, page, limit, signal: controller.signal }))
            .then((res) => {
                if (res?.data?.data) {
                    setAllPost(prev => [...prev, ...res.data.data.docs])
                    setHasNextPage(res.data?.data?.hasNextPage)
                }
            })
            .finally(() => {
                setLoading(false)
            })
            
        return () => controller.abort()
    }, [profileId, page, limit])

    useEffect(() => {
        const scrollFn = paginationHandler({scrollContainer, hasNextPage, setPage})

        return () =>  scrollContainer?.removeEventListener("scroll", scrollFn)
    }, [scrollContainer, hasNextPage, setPage])


    return (
        <section className="w-full">
            {allPost.length > 0 ?
                (<ul className="w-full grid grid-cols-3 gap-1 py-4">
                    {allPost?.map((post) => (
                        <li
                            className="aspect-4/5 w-full"
                            key={post?._id}
                        >
                            <Post 
                                post={post}
                                isCurrentUser = {isCurrentUser} 
                            />
                        </li>
                    ))}
                </ul>) :
                (
                    <EmptyPage
                        heading="✨ No Posts Yet"
                        firstMessage="This profile hasn't shared anything yet."
                        secondMessage="Once they do, their posts will appear here!"
                    />
                )
            }
            {loading &&
                <div className="w-fit mx-auto">
                    <Loader />
                </div>}
        </section>
    )
}