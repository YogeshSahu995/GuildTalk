import { apiCallHandler } from "../utils/apiCallHandler"

const toggleLike = async({postId, signal}) => {
    return await apiCallHandler({
        endpoint: `/like/toggle/${postId}`,
        method: "post",
        signal
    })
}

const getAllLikedPosts = async({limit, page, signal}) => {
    return await apiCallHandler({
        endpoint: `/like/get/liked-post?page=${page}&limit=${limit}`,
        method: "get",
        signal
    })
}

const getPostLikes = async({postId, signal}) => {
    return await apiCallHandler({
        endpoint: `/like/get/likes/${postId}`,
        method: "get",
        signal
    })
}

export {getAllLikedPosts, getPostLikes, toggleLike}