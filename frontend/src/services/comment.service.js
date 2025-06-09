import { apiCallHandler } from "../utils/apiCallHandler";
import { jsonFormatte } from "../const";

const addAComment = async({data, postId}) => {
    return await apiCallHandler({
        endpoint: `/comment/add/${postId}`,
        method: "post",
        data,
        headers: jsonFormatte
    })
}

const deleteAComment = async({commentId}) => {
    return await apiCallHandler({
        endpoint: `/comment/delete/${commentId}`,
        method: "delete",
    })
}

const getAPostComment = async({postId, signal}) => {
    return await apiCallHandler({
        endpoint: `/comment/get/${postId}`,
        method: "get",
        signal: signal
    })
}
export {getAPostComment, deleteAComment, addAComment}