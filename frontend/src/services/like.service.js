import { apiCallHandler } from "../utils/apiCallHandler"

const toggleLike = async({postId}) => {
    return await apiCallHandler({
        endpoint: `/like/toggle/${postId}`,
        method: "post"
    })
}

const getAllLikedPosts = async({limit, page}) => {
    return await apiCallHandler({
        endpoint: `/like/get/liked-post?page=${page}&limit=${limit}`,
        method: "get"
    })
}

const getPostLikes = async({postId}) => {
    return await apiCallHandler({
        endpoint: `/like/get/likes/${postId}`,
        method: "get"
    })
}

export {getAllLikedPosts, getPostLikes, toggleLike}