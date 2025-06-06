import mongoose, { isValidObjectId } from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Comment } from "../models/comment.model.js";

const addAComment = asyncHandler(async(req, res) => {
    const {comment} = req.body
    const {postId} = req.params

    if(!isValidObjectId(postId)){
        throw new ApiError(400, "post or owner id are invalid")
    }

    if(!comment?.trim()){
        throw new ApiError(400, "comment is required")
    }

    const addedComment = await Comment.create({
        comment,
        owner: req.user?._id,
        post: postId
    })

    if(!addAComment){
        throw new ApiError(500, "Any issue in commenting on video")
    }

    return res.status(200)
    .json(new ApiResponse(200, addedComment, "Successfully comment on video"))
})

const deleteAComment = asyncHandler(async(req, res) => {
    const {commentId} = req.params
    const ownerId = req.user?._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "comment id is invalid")
    }

    const isOwner = await Comment.findOne({
        _id: commentId, 
        owner: new mongoose.Types.ObjectId(ownerId)
    })

    if(!isOwner){
        throw new ApiError(400, "You are not an owner of the comment")
    }

    const deletedComment = await Comment.deleteOne({_id: commentId, owner: ownerId})

    if(!deletedComment){
        throw new ApiError(500, "Any issue in delete a comment")
    }

    return res.status(200)
    .json(new ApiResponse(200, deletedComment, "successfully delete a comment"))
})

const getPostComments = asyncHandler(async(req, res) => {
    const {postId} = req.params

    if(!isValidObjectId(postId)){
        throw new ApiError(400, "Post id is invalid")
    }

    const allComments = await Comment.aggregate([
        {
            $match: {
                post: new mongoose.Types.ObjectId(postId) 
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "owner",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            _id: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$owner"
            }
        },
        {
            $project: {
                post:0
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    if(!allComments){
        throw new ApiError(500, "Any issue in getting all comments")
    }

    return res.status(200)
    .json(new ApiResponse(200, allComments, "Successfully getting all comments of a post"))
})

export {addAComment, deleteAComment, getPostComments}