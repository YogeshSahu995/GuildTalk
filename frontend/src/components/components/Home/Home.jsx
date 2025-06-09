import { useCallback, useEffect, useState } from "react"
import { BigLoader, EmptyPage } from "../../ui"
import { searchPorfileByUsername } from "../../../services/user.service"
import { searchGroupsByName } from "../../../services/group.service"
import { useOutletContext } from "react-router-dom"
import { SingleGroup, SingleProfile } from "../index"
import { paginationHandler } from "../../../utils/paginationHandler"
import { useDebounce } from "../../../utils/useDebounce"

export function Home() {
    const [hasNextPage, setHasNextPage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [searchedProfile, setSearchedProfile] = useState([])
    const [searchedGroup, setSearchedGroup] = useState([])
    const [prevQuery, setPrevQuery] = useState("")
    const [prevType, setPrevType] = useState("")
    const { searchInput, searchType, scrollContainer } = useOutletContext()
    const query = useDebounce(searchInput?.trim())

    useEffect(() => {
        const handleScroll = paginationHandler({ hasNextPage, scrollContainer, setPage })

        return () => {
            scrollContainer?.removeEventListener("scroll", handleScroll)
        }
    }, [hasNextPage, scrollContainer, setPage])

    const searchProfile = useCallback(({ signal, reset = false }) => {
        setLoading(true)
        
        //clear all profiles
        if (reset) setSearchedProfile([])

        Promise.resolve(searchPorfileByUsername({ query, page, limit, signal }))
            .then(res => {
                if (res?.data?.data?.docs) {
                    setSearchedProfile(prev => [...(reset ? [] : prev), ...res?.data?.data?.docs])
                    setHasNextPage(res?.data?.data?.hasNextPage)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [query, searchType, page])

    const searchGroup = useCallback(({ signal, reset = false }) => {
        setLoading(true)
        if (reset) setSearchedGroup([]) //set groups empty
        Promise.resolve(searchGroupsByName({ query, page, limit, signal }))
            .then(res => {
                if (res?.data?.data?.docs) {
                    setSearchedGroup(prev => [...(reset ? [] : prev), ...res.data.data.docs])
                    setHasNextPage(res.data.data.hasNextPage)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [query, searchType, page])

    //search profiles and groups
    useEffect(() => {
        const controller = new AbortController()
        const isNewSearch = query !== prevQuery || searchType !== prevType

        if (query?.trim()) {
            if (searchType === "Profile") {
                searchProfile({ signal: controller.signal, reset: isNewSearch })
            }

            if (searchType === "Group") {
                searchGroup({ signal: controller.signal, reset: isNewSearch })
            }
        }

        if (isNewSearch) {
            setPage(1)
            setPrevQuery(query)
            setPrevType(searchType)
        }

        return () => controller.abort()
    }, [query, searchType, page])

    if (!query.trim()) {
        return <EmptyPage
            heading="👋 Welcome to Home"
            firstMessage={<span>You can search for <strong>profiles</strong> and <strong>groups</strong> using the search bar above.</span>}
            secondMessage="Start exploring and connecting now!"
        />
    }
    return (
        <div className="h-fit w-full">

            {searchType === "Profile" &&
                <div>
                    {searchedProfile?.map((profile) =>
                        <div key={profile?._id}>
                            <SingleProfile profile={profile} />
                        </div>
                    )}
                    {searchedProfile?.length == 0 && query?.trim() && (
                        <EmptyPage
                            heading={`🚫 Not Exists Any Channel`}
                            firstMessage={`No one's channel is exist with this "${query}" name`}
                            secondMessage={`try another name!!`}
                        />
                    )}
                </div>}

            {searchType === "Group" &&
                <div>
                    {searchedGroup?.map((group) =>
                        <div key={group?._id}>
                            <SingleGroup group={group} />
                        </div>
                    )}
                    {searchedGroup?.length == 0 && query?.trim() && (
                        <EmptyPage
                            heading={`🚫 Not Exists Any Group`}
                            firstMessage={`No one's group is exist with this "${query}" name`}
                            secondMessage={`try another name!!`}
                        />
                    )}
                </div>}
                 {loading && <BigLoader />}
        </div>
    )
}