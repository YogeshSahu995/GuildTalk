import { isValidObjectId } from "mongoose"
import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js"
import { Post, Like } from "../models/index.js"

const togglePostLike = asyncHandler(async (req, res) => {
    const { postId } = req.params

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Post id is invalid")
    }

    const isExist = await Post.findById(postId)

    if (!isExist) {
        throw new ApiError(404, "Post is not exist")
    }

    const isLiked = await Like.findOne({ post: postId, likedBy: req.user?._id })

    if (isLiked) {
        const unLikedAVideo = await Like.deleteOne({ post: postId, likedBy: req.user?._id })

        return res.status(200)
            .json(new ApiResponse(200, false, "Successfully unlike the post"))
    }
    else {
        const LikedAVideo = await Like.create({ post: postId, likedBy: req.user?._id })

        return res.status(200)
            .json(new ApiResponse(200, true, "Successfully like the post"))
    }
})

const getLikedPost = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query

    const pageNumber = Math.max(1, parseInt(page))
    const limitNumber = Math.max(1, parseInt(limit))

    const pipline = [
        {
            $match: {
                likedBy: req.user?._id
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]

    const allLikedPost = await Like.aggregatePaginate(Like.aggregate(pipline),
        {
            page: pageNumber,
            limit: limitNumber
        })

    return res.status(200)
        .json(new ApiResponse(200, allLikedPost, "Successfully get all liked post"))
})

const getPostLikes = asyncHandler(async(req, res) => {
    const {postId} = req.params

    if(!isValidObjectId(postId)){
        throw new ApiError(400, "Post ID is invalid")
    }

    const postLikes = await Like.find({post: postId}).populate('likedBy', "avatar username email _id")

    return res.status(200)
    .json(new ApiResponse(200, postLikes, "Successfully get all like of post"))
})

export { togglePostLike, getLikedPost, getPostLikes }