import { apiCallHandler } from "../utils/apiCallHandler"
import { multipartFormatte } from "../const"

const createAGroup = async({formData}) => {
    return await apiCallHandler({
        endpoint: `/group/create/guild`,
        method: "post",
        data: formData,
        headers: multipartFormatte
    })
}

const changeAdmin = async({adminId, groupId}) => {
    return await apiCallHandler({
        endpoint: `/group/change/admin/${adminId}/${groupId}`,
        method: "patch",
    })
}

const deleteAGroup = async({groupId}) => {
    return await apiCallHandler({
        endpoint: `/group/delete/guild/${groupId}`,
        method: "delete"
    })
}

const changeGroupAvatar = async({groupId, data}) => {
    return await apiCallHandler({
        endpoint: `/group/update/avatar/guild/${groupId}`,
        data,
        method: "patch",
        headers: multipartFormatte
    })
}

const changeGroupCoverImage = async({groupId, data}) => {
    return await apiCallHandler({
        endpoint: `/group/update/cover-image/guild/${groupId}`,
        data,
        method: "patch",
        headers: multipartFormatte
    })
}

const getAllGroupsOfUser = async({signal}) => {
    return await apiCallHandler({
        endpoint: `/group/get/all/guild`,
        method: "get",
        signal,
    })
}

const addRequestInGroup = async({groupId, memberId}) => {
    return await apiCallHandler({
        endpoint: `/group/req/guild/${groupId}/${memberId}`,
        method: "post"
    })
}

const addMemberInGroup = async({groupId, memberId}) => {
    return await apiCallHandler({
        endpoint: `/group/add/guild/${groupId}/${memberId}`,
        method: "post"
    })
}

const searchGroupsByName = async({page, limit, query, signal}) => {
    return await apiCallHandler({
        endpoint: `/group/search/all/guild?page=${page}&limit=${limit}&query=${query}`,
        method: "get",
        signal: signal
    })
}

const getGroupById = async({groupId, signal}) => {
    return await apiCallHandler({
        endpoint: `/group/get/group/details/${groupId}`,
        method: "get",
        signal
    })
}

const checkRequestIsSendedOrNot = async({groupId}) => {
    return await apiCallHandler({
        endpoint: `/group/get/already/request/${groupId}`,
        method: "get"
    })
}

const checkIsJoinedTheGroup = async({groupId, signal}) => {
    return await apiCallHandler({
        endpoint: `/group/get/join/details/${groupId}`,
        method: "get",
        signal
    })
}

const getAllMembersOfGroup = async({groupId}) => {
    return apiCallHandler({
        endpoint: `/group/get/all/member/${groupId}`,
        method: "get"
    })
}

const removeTheMemberOfGroup = async({memberId, groupId}) => {
    return await apiCallHandler({
        endpoint: `/group/remove/member/${memberId}/${groupId}`,
        method: "patch"
    })
}

const getAllRequestsOfGroup = async({groupId,signal}) => {
    return await apiCallHandler({
        endpoint: `/group/get/all/requests/${groupId}`,
        method: "get",
        signal
    })
}

const rejectRequestOfUser = async({requestUserId, groupId}) => {
    return apiCallHandler({
        endpoint: `/group/reject/request/user/${requestUserId}/${groupId}`,
        method: "patch"
    })
}

const checkUserExistInGroup = async({groupId, userId}) => {
    return await apiCallHandler({
        endpoint: `/group/check/user/exist/${userId}/${groupId}`,
        method: "get"
    })
}

export {
    createAGroup,
    changeAdmin,
    changeGroupAvatar,
    changeGroupCoverImage,
    searchGroupsByName,
    addMemberInGroup,
    addRequestInGroup,
    getAllGroupsOfUser,
    deleteAGroup,
    getGroupById,
    checkRequestIsSendedOrNot,
    checkIsJoinedTheGroup,
    getAllMembersOfGroup,
    removeTheMemberOfGroup,
    getAllRequestsOfGroup,
    rejectRequestOfUser,
    checkUserExistInGroup
}