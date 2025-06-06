import { multipartFormatte } from "../const"
import { apiCallHandler } from "../utils/apiCallHandler"

const uploadAPost = async({formData}) => {
    return await apiCallHandler({
        endpoint: `/post/upload/c`,
        data: formData,
        method: "post",
        headers: multipartFormatte
    })
}

const getAllPostOfUser = async({userId, page, limit}) => {
    return await apiCallHandler({
        endpoint: `/post/get/all/${userId}?page=${page}&limit=${limit}`,
        method: "get"
    })
}

const getPostDetails = async({postId}) => {
    return await apiCallHandler({
        endpoint: `/post/get/post/details/${postId}`,
        method: "get"
    })
}

const deleteAPost = async({postId}) => {
    return await apiCallHandler({
        endpoint: `/post/delete/post/${postId}`,
        method: "delete"
    }) 
}

export {
    getAllPostOfUser, 
    uploadAPost, 
    getPostDetails, 
    deleteAPost
}