import { useEffect, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import { getAllFollowers } from "../../../services/follow.service"
import { EmptyPage, Loader } from "../../ui"
import { SingleProfile } from "./SingleProfile"
import { paginationHandler } from "../../../utils/paginationHandler"

export function ProfileFollowers() {
    const { username } = useParams()
    const [page, setPage] = useState(1) //todo
    const [limit, setLimit] = useState(2)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [allFollowers, setAllFollowers] = useState([])
    const [loading, setLoading] = useState(false)
    const {scrollContainer} = useOutletContext()

    useEffect(() => {
        const scrollFn = paginationHandler({ scrollContainer, hasNextPage, setPage })

        return () => scrollContainer?.removeEventListener("scroll", scrollFn)
    }, [scrollContainer, hasNextPage, setPage])

    useEffect(() => {
        (async () => {
            setLoading(true)
            await Promise.resolve(getAllFollowers({ username, page, limit }))
                .then((res) => {
                    if (res?.data?.data?.docs) {
                        setAllFollowers(prev => [...prev, ...res.data.data.docs])
                        setHasNextPage(res.data.data?.hasNextPage)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        })()
    }, [username, page, limit])

    return (
        <div className="h-fit">
            <div className="sticky top-0 bg-[#E5D9F2] dark:bg-[#001F3F] shadow-2xl z-[999]">
                <h1 className="text-2xl lg:text-3xl p-2">Followers</h1>
                <hr className="text-[#00000066] dark:text-[#ffffff86]" />
            </div>
            {allFollowers.length > 0 ?
                (<ul>
                    {allFollowers?.map(({ follower }) => (
                        <li key={follower?._id}>
                            <SingleProfile profile={follower} />
                        </li>
                    ))}
                </ul>)
                : (
                    <EmptyPage heading="😅 No followers yet." />
                )
            }
            {loading &&
                <div className="w-fit mx-auto">
                    <Loader />
                </div>
            }
        </div>
    )
}