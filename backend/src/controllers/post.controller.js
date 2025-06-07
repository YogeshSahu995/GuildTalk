import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import { Like, Post, Comment } from "../models/index.js";
import { ApiError, ApiResponse, asyncHandler, removeOnCloudinary, uploadOnCloudinary } from "../utils/index.js";

const uploadAPost = asyncHandler(async(req, res) => {
    const imagePath = req?.file?.path
    const {caption} = req.body

    if(!imagePath){
        throw new ApiError(400, "Image is required")
    }

    const uploadDetails = await uploadOnCloudinary(imagePath, "image")

    if(!uploadDetails){
        throw new ApiError(500, "Any issue in uploading image on cloudinary")
    }

    const uploadedPost = await Post.create({
        image: uploadDetails?.secure_url,
        caption: caption,
        owner: req.user?._id,
    })

    if(!uploadedPost){
        throw new ApiError(500, "Any issue in uploading image on cloudinary")
    }

    return res.status(200)
    .json(new ApiResponse(200, uploadedPost, "Successfully uploaded a post"))
})

const getProfilePosts = asyncHandler(async(req, res) => {
    const {profileId} = req.params
    const {page = 1, limit = 8} = req.query

    if(!isValidObjectId(profileId)){
        throw new ApiError(400, "Profile ID is invalid")
    }

    const pageNumber = Math.max(1, parseInt(page))
    const limitNumber = Math.max(1, parseInt(limit))

    const pipline = [
        {
            $match: {
                owner : new mongoose.Types.ObjectId(profileId)
            }
        },
        {
            $sort: {
                createdBy: -1
            }
        }
    ]

    const options = {
        page: pageNumber,
        limit: limitNumber
    }

    const allPost = await Post.aggregatePaginate(Post.aggregate(pipline), options)


    return res.status(200)
    .json(new ApiResponse(200, allPost, "Successfully fetched all posts"))
})

const getPostDetails = asyncHandler(async(req, res) => {
    const {postId} = req.params

    if(!isValidObjectId(postId)){
        throw new ApiError(400, "Post ID is invalid")
    }

    const PostDetails = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postId)
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
                            _id: 1,
                            email: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                foreignField: "post",
                localField: "_id",
                as: "likes",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "comments",
                foreignField: "post",
                localField: "_id",
                as: "comments",
                pipeline: [
                    {
                        $project: {
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                isLiked: {
                    $cond: {
                        if: {$in: [req?.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                },
                likeCount: {
                    $size: {
                        $ifNull: ["$likes", []]
                    }
                },
                commentCount: {
                    $size: {
                        $ifNull: ["$comments", []]
                    }
                }
            }
        },
        {
            $unwind: {
                path: "$owner"
            }
        },
        {
            $project: {
                isLiked: 1,
                likeCount: 1, 
                commentCount: 1,
                caption: 1,
                owner: 1,
                image: 1,
                createdAt: 1
            }
        }
    ])

    if(!PostDetails){
        throw new ApiError(400, "Issue in Fetching A Post")
    }

    return res.status(200)
    .json(new ApiResponse(200, PostDetails[0], "Successfully fetched Post"))
})

const deletePost = asyncHandler(async(req, res) => {
    const {postId} = req.params

    if(!isValidObjectId(postId)){
        throw new ApiError(400, "Post Id is invalid")
    }
    const postData = await Post.findOne({_id: postId})

    if(!postData){
        throw new ApiError("Post is not exists")
    }

    
    const isPostDelete = await Post.findOneAndDelete({_id: postId, owner: req.user?._id})
    
    if(!isPostDelete){
        throw new ApiError(400, "You are not owner of this post")
    }
    
    await removeOnCloudinary(postData?.image)

    const deleteAllLikes = await Like.deleteMany({post: postId})

    if(!deleteAllLikes){
        throw new ApiError(400, "Any Issue in delete all likes")
    }
    const deleteAllComments = await Comment.deleteMany({post: postId})

    if(!deleteAllComments){
        throw new ApiError(400, "Any Issue in delete all likes")
    }

    return res.status(200)
    .json(new ApiResponse(200, true, "successfully delete a Post"))

})

export {uploadAPost, getProfilePosts, getPostDetails, deletePost}