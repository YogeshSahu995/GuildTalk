import { jsonFormatte } from "../const"
import { apiCallHandler } from "../utils/apiCallHandler"

const saveTheMessage = async({ senderId, receiverId, message, messageType}) => {
    return apiCallHandler({
        endpoint: `/message/save/${senderId}/${receiverId}`,
        data: {message, messageType},
        headers: jsonFormatte,
        method: "post",
    })
}

const getAllMessage = async({limit, page, anotherUserId}) => {
    return await apiCallHandler({
        endpoint: `/message/get/messages/${anotherUserId}?page=${page}&limit=${limit}`
    })
}

const deleteAMessage = async({messageId}) => {
    return await apiCallHandler({
        endpoint: `/message/delete/message/${messageId}`,
        method: "delete"
    })
}

const saveTheGroupMessage = async({message, senderId, groupId, messageType}) => {
    return await apiCallHandler({
        endpoint: `/message/group/save/${senderId}/${groupId}`,
        method: "post",
        data: {message, messageType},
        headers: jsonFormatte
    })
}

const getAllMessageOfGroup = async({groupId, page, limit}) => {
    return await apiCallHandler({
        endpoint: `/message/get/messages/group/${groupId}?page=${page}&limit=${limit}`,
        method: "get",
    })
}

const getAllUserAndGroup = async() => {
    return await apiCallHandler({
        endpoint: `/message/get/profiles`,
        method: "get"
    })
}

const getLatestmessage = async({groupId}) => {
    return await apiCallHandler({
        endpoint: `/message/get/group/latest/message/${groupId}`,
        method: "get"
    })
}

export { 
    saveTheMessage, 
    getAllMessage, 
    deleteAMessage, 
    saveTheGroupMessage, 
    getAllMessageOfGroup, 
    getAllUserAndGroup,
    getLatestmessage
}