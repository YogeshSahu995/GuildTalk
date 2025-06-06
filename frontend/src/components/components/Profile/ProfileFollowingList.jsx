import { useEffect, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import { getAllFollowingProfile } from "../../../services/follow.service"
import { EmptyPage, Loader } from "../../ui"
import { SingleProfile } from "./SingleProfile"
import { paginationHandler } from "../../../utils/paginationHandler"

export function ProfileFollowingList() {
    const { username } = useParams()
    const [page, setPage] = useState(1) //todo
    const [limit, setLimit] = useState(10)
    const [allFollowing, setAllFollowing] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(false)
    const { scrollContainer } = useOutletContext()

    //pagination handler
    useEffect(() => {
        const scrollFn = paginationHandler({ scrollContainer, hasNextPage, setPage })

        return () => scrollContainer?.removeEventListener("scroll", scrollFn)
    }, [scrollContainer, hasNextPage, setPage])

    //fetch all profile
    useEffect(() => {
        setLoading(true)
        Promise.resolve(getAllFollowingProfile({ username, page, limit }))
            .then((res) => {
                if (res?.data?.data?.docs) {
                    setAllFollowing(prev => [...prev, ...res.data.data?.docs])
                    setHasNextPage(res.data?.data?.hasNextPage)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [username, page, limit])


    return (
        <div className="h-fit">
            <div className="sticky top-0 bg-[#E5D9F2] dark:bg-[#001F3F] shadow-lg z-[999]">
                <h1 className="text-2xl lg:text-3xl p-2">Following</h1>
                <hr className="text-[#00000066] dark:text-[#ffffff86]" />
            </div>
            {
                <ul>
                    {allFollowing?.map(({ profile }) => (
                        <li key={profile._id}>
                            <SingleProfile profile={profile} />
                        </li>
                    ))}
                </ul>
            }
            {!loading && allFollowing?.length == 0 && <EmptyPage heading="You’re not following anyone at the moment." />}
            {loading &&
                <div className="w-fit mx-auto">
                    <Loader />
                </div>
            }
        </div>
    )
}