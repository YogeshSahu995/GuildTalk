import mongoose, { isValidObjectId } from "mongoose";
import { Follow, User } from "../models/index.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";


const toggleFollow = asyncHandler(async (req, res) => {
    const { anotherUserId } = req.params

    if (!isValidObjectId(anotherUserId)) {
        throw new ApiError(400, "User id is not valid")
    }

    const isExistUser = User.findById(anotherUserId)

    if (!isExistUser) {
        throw new ApiError(400, "User is not exist")
    }

    const alreadyFollow = await Follow.findOne({
        follower: req.user._id,
        profile: anotherUserId
    })

    if (alreadyFollow) {
        await Follow.deleteOne({
            follower: req.user._id,
            profile: anotherUserId
        })

        return res.status(200)
        .json(new ApiResponse(200, false, "Succesfully Unfollow the user"))
    }
    else{
        await Follow.create({
            follower: req.user._id,
            profile: anotherUserId
        })

        return res.status(200)
        .json(new ApiResponse(200, true, "Successfully follow the user"))
    }

})

const getAllFollower = asyncHandler(async(req, res) => {
    const {username} = req.params
    const {page = 1, limit = 10} = req.query

    const user = await User.findOne({username})

    if(!user){
        throw new ApiError(400, "User is not exist")
    }

    const pipline = [
        {
            $match: {
                profile: user?._id
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: 'follower',
                as: "follower",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$follower"
            }
        },
        {
            $project: {
                follower: 1,
                createdAt: 1,
            }
        }
    ]

    const options = {
        page: Math.max(1, parseInt(page)),
        limit: Math.max(1, parseInt(limit))
    }

    const allFollowers = await Follow.aggregatePaginate(Follow.aggregate(pipline), options)

    if(!allFollowers){
        throw new ApiError(500, "Any Issue in fetching all followers")
    }

    return res.status(200)
    .json(new ApiResponse(200, allFollowers, "Successfully fetched all followers"))

})

const getAllFollowingProfile = asyncHandler(async(req, res) => {
    const {username} = req.params
    const {page, limit} = req.query

    const user = await User.findOne({username})

    if(!user){
        throw new ApiError(400, "User is not exist")
    }

    const pipline = [
        {
            $match: {
                follower: user?._id
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: 'profile',
                as: "profile",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$profile"
            }
        },
        {
            $project: {
                profile: 1,
                createdAt: 1,
            }
        }
    ]

    const options = {
        page: Math.max(1, parseInt(page)),
        limit: Math.max(1, parseInt(limit))
    }

    const allFollowingProfile = await Follow.aggregatePaginate(Follow.aggregate(pipline), options)

    if(!allFollowingProfile){
        throw new ApiError(500, "Any Issue in fetching all followers")
    }

    return res.status(200)
    .json(new ApiResponse(200, allFollowingProfile, "Successfully fetched all following Profile"))

})

const isFollowed = asyncHandler(async(req, res) => {
    const {profileId} = req.params
    const userId = req.user?._id

    const isfollowing = await Follow.findOne({profile: profileId, follower: userId})

    if(!isfollowing){
        return res.status(200)
        .json(new ApiResponse(200, false, "No, you not follow the profile"))
    }
    
    return res.status(200)
    .json(new ApiResponse(200, true, "Yes, you follow the profile"))
})

export { toggleFollow, getAllFollower, getAllFollowingProfile, isFollowed}