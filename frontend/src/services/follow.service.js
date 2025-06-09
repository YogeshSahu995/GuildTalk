import { apiCallHandler } from "../utils/apiCallHandler"

const toggleFollow = async({anotherUserId}) => {
    return await apiCallHandler({
        endpoint: `/follow/toggle/${anotherUserId}`,
        method: "post",
    })
}

const getAllFollowers = async({username, page, limit, signal}) => {
    return await apiCallHandler({
        endpoint: `/follow/get/followers/${username}?page=${page}&limit=${limit}`,
        method: "get",
        signal
    })
}

const getAllFollowingProfile = async({username, page, limit}) => {
    return await apiCallHandler({
        endpoint: `/follow/get/following/${username}?page=${page}&limit=${limit}`,
        method: "get",
    })
}

const isFollowed = async({profileId, signal}) => {
    return await apiCallHandler({
        endpoint: `/follow/is/followed/${profileId}`,
        method: "get",
        signal
    })
}

export {toggleFollow, getAllFollowers, getAllFollowingProfile, isFollowed}