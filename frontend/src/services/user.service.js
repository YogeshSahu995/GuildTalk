import { apiCallHandler } from "../utils/apiCallHandler"
import { jsonFormatte, multipartFormatte } from "../const"


const registerUser = async({formData}) => {
    return await apiCallHandler({
        endpoint: "/user/register",
        method: "post",
        data: formData,
        headers: multipartFormatte
    })
}

const loginUser = async ({username, password}) => {
    return await apiCallHandler({
        endpoint: "/user/login", 
        method: "post",
        data: {username, password}, 
        headers: jsonFormatte
    })
}

const logoutUser = async() => {
    return await apiCallHandler({
        endpoint: "/user/logout",
        method: "post"
    })
}

const getCurrentUser = async() => {
    return await apiCallHandler({
        endpoint: "/user/current-user",
        method: "get",
    })
}

const getProfileByUsername = async({username, signal}) => {
    return await apiCallHandler({
        endpoint: `/user/get/profile/${username}`,
        method: "get",
        signal
    })
}

const updateAvatar = async({formData}) => {
    return await apiCallHandler({
        endpoint: "/user/update/avatar",
        data : formData,
        method: "patch",
        headers: multipartFormatte
    })
}

const updateUsername = async({username}) => {
    return await apiCallHandler({
        endpoint: `/user/update/username`,
        data: {username},
        method: "patch",
        headers: jsonFormatte
    })
}

const searchPorfileByUsername = async({query, page, limit, signal}) => {
    return await apiCallHandler({
        endpoint: `/user/search/profile?query=${query}&page=${page}&limit=${limit}`,
        method: "GET",
        signal,
    })
}

const getUserDetailsById = async({anotherUserId, signal}) => {
    return await apiCallHandler({
        endpoint: `/user/get/details/${anotherUserId}`,
        method: "get",
        signal
    }) 
}

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getProfileByUsername,
    updateAvatar,
    updateUsername,
    searchPorfileByUsername,
    getUserDetailsById
}