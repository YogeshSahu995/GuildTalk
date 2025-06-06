import { ApiError, ApiResponse, asyncHandler, removeOnCloudinary, uploadOnCloudinary } from "../utils/index.js";
import { Group, User } from "../models/index.js";
import mongoose, { isValidObjectId } from "mongoose";

const createGroup = asyncHandler(async (req, res) => {
    const adminId = req.user?._id
    const { groupName } = req.body
    const groupAvatarPath = req.files?.groupAvatar?.[0]?.path
    const groupCoverImagePath = req.files?.groupCoverImage?.[0]?.path

    const alreadyExistName = await Group.findOne({ groupName })

    if (alreadyExistName) {
        throw new ApiError(400, "Guild already exist with this name")
    }

    if (!groupName?.trim()) {
        throw new ApiError(400, "Guild name is required")
    }

    if (!groupAvatarPath) {
        throw new ApiError(400, "Avatar of Group is required")
    }

    const groupAvatar = await uploadOnCloudinary(groupAvatarPath, "image")

    let groupCoverImage

    if (groupCoverImagePath) {
        groupCoverImage = await uploadOnCloudinary(groupCoverImagePath, "image")
    }

    const createdGuild = await Group.create({
        admin: adminId,
        groupAvatar: groupAvatar?.secure_url,
        groupCoverImage: groupCoverImage?.secure_url || "",
        groupName,
    })

    if (!createdGuild) {
        throw new ApiError(500, "Any Issue in creating a guild")
    }

    const addAdminIdInMembers = await Group.findByIdAndUpdate(
        createdGuild?._id,
        {
            $addToSet: {
                members: adminId,
            }
        },
    )

    if (!addAdminIdInMembers) {
        throw new ApiError(500, "Any Issue in adding admin in member list")
    }

    const addGroupId = await User.findByIdAndUpdate(
        adminId,
        {
            $addToSet: {
                groups: createdGuild?._id
            }
        },
    )

    if (!addGroupId) {
        throw new ApiError(500, "Any Issue in adding a group ID")
    }

    return res.status(200)
        .json(new ApiResponse(200, createdGuild, "Successfully created a guild"))

})

const changeAdmin = asyncHandler(async (req, res) => {
    const { adminId, groupId } = req.params

    if (!isValidObjectId(adminId)) {
        throw new ApiError(400, "User ID is not valid")
    }

    if(adminId === req?.user?._id){
        throw new ApiError(400, "Again you choose same admin")
    }

    const isGuildLeader = await Group.findOne({ _id: groupId, admin: req?.user?._id })

    if (!isGuildLeader) {
        throw new ApiError(400, "You are not guild leader")
    }

    const changedAdmin = await Group.updateOne(
        { _id: groupId },
        {
            $set: {
                admin: adminId
            }
        }
    )

    if (!changeAdmin) {
        throw new ApiError(500, "Any Issue in changing Admin")
    }


    return res.status(200)
        .json(new ApiResponse(200, changedAdmin, "Successfully changed a admin of Guild"))
})

const deleteGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params

    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "Guild ID is invalid")
    }

    const isExistGuild = await Group.findById(groupId)

    if (!isExistGuild) {
        throw new ApiError(404, "Guild is not exist by this ID")
    }

    const isDelete = await Group.findByIdAndDelete(groupId)

    if (!isDelete) {
        throw new ApiError(500, "Any issue in delete the guild")
    }

    return res.status(200)
        .json(new ApiError(200, isDelete, "Successfully delete the guild"))
})

const updateGroupAvatar = asyncHandler(async (req, res) => {
    const groupAvatarPath = req.file?.path
    const { groupId } = req.params

    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "Guild ID is invalid")
    }

    if (!groupAvatarPath) {
        throw new ApiError(400, "Avatar of Group is required")
    }

    const guildInfo = await Group.findById(groupId)

    if (!guildInfo) {
        throw new ApiError(400, "Guild is not exist by this ID")
    }

    await removeOnCloudinary(guildInfo?.groupAvatar)

    const groupAvatar = await uploadOnCloudinary(groupAvatarPath, "image")

    const updatedGuildAvatar = await Group.findByIdAndUpdate(
        groupId,
        {
            $set: {
                groupAvatar: groupAvatar?.secure_url
            }
        },
        {
            new: true
        }
    )

    if (!updatedGuildAvatar) {
        throw new ApiError(500, "Any issue in updating Guild avatar")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedGuildAvatar, "Successfully update the avatar"))
})

const updateGroupCoverImage = asyncHandler(async (req, res) => {
    const groupCoverImagePath = req.file?.path
    const { groupId } = req.params

    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "Guild ID is invalid")
    }

    if (!groupCoverImagePath) {
        throw new ApiError(400, "coverImage of Group is required")
    }

    const guildInfo = await Group.findById(groupId)

    if (!guildInfo) {
        throw new ApiError(400, "Guild is not exist by this ID")
    }

    await removeOnCloudinary(guildInfo?.groupCoverImage)

    const groupCoverImage = await uploadOnCloudinary(groupCoverImagePath, "image")

    const updatedGuildCoverImage = await Group.findByIdAndUpdate(
        groupId,
        {
            $set: {
                groupCoverImage: groupCoverImage?.secure_url
            }
        },
        {
            new: true
        }
    )

    if (!updatedGuildCoverImage) {
        throw new ApiError(500, "Any issue in updating Guild coverImage")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedGuildCoverImage, "Successfully update the coverImage"))
})

const addMemberInGroup = asyncHandler(async (req, res) => {
    const { memberId, groupId } = req.params

    if (!isValidObjectId(memberId) || !isValidObjectId(groupId)) {
        throw new ApiError(400, "Member or Guild ID is invalid")
    }

    const addedMember = await Group.findByIdAndUpdate(
        groupId,
        {
            $addToSet: { //$push not use
                members: memberId
            },
            $pull: {
                requestList: memberId
            }
        },
        { new: true }
    )

    if (!addedMember) {
        throw new ApiError(500, "Any Issue in adding a member ID")
    }

    //add group id in user document
    const addGroupId = await User.findByIdAndUpdate(
        memberId,
        {
            $addToSet: {
                groups: groupId
            }
        }
    )

    if (!addGroupId) {
        throw new ApiError(500, "Any Issue in adding a group ID")
    }

    return res.status(200)
        .json(new ApiResponse(200, addedMember, "Successfully added a Member."))
})

const addRequestInGroup = asyncHandler(async (req, res) => {
    const { memberId, groupId } = req.params

    if (!isValidObjectId(memberId) || !isValidObjectId(groupId)) {
        throw new ApiError(400, "Member or guild ID is Invalid")
    }

    const isExist = await User.findById(memberId)

    if (!isExist) {
        throw new ApiError(400, "User is not exists")
    }

    const addRequest = await Group.findByIdAndUpdate(
        groupId,
        {
            $addToSet: {
                requestList: memberId
            }
        },
        {
            new: true
        }
    )

    if (!addRequest) {
        throw new ApiError(400, "Any Issue in give a request")
    }

    return res.status(200)
        .json(new ApiResponse(200, addRequest, "Successfully added request on group"))
})

const getAllGroupsOfUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const allGroups = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "groups",
                foreignField: "_id",
                localField: "groups",
                as: "groups",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            foreignField: "_id",
                            localField: "admin",
                            as: "admin",
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
                            path: "$admin"
                        }
                    },
                    {
                        $addFields: {
                            memberCount: {
                                $size: "$members"
                            },
                        }
                    },
                    {
                        $project: {
                            groupName: 1,
                            admin: 1,
                            groupAvatar: 1,
                            groupCoverImage: 1,
                            memberCount: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                groups: 1
            }
        }
    ])

    if (!allGroups[0]) {
        throw new ApiError(400, "Problem in fetching groups")
    }

    return res.status(200)
        .json(new ApiResponse(200, allGroups[0], "Successfully get groups of user"))
})

const searchGroupByName = asyncHandler(async (req, res) => {
    const { query, page = 1, limit = 10, } = req.query
    const userId = req.user?._id

    const pageNumber = Math.max(1, parseInt(page))
    const limitNumber = Math.max(1, parseInt(limit))

    const pipeline = [
        {
            $match: {
                ...(query ? {
                    groupName: {
                        $regex: query,
                        $options: "i"
                    }
                } : {})
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "admin",
                as: "admin",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            avatar: 1,
                            _id: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$admin",
            }
        },
        {
            $addFields: {
                isJoined: {
                    $cond: {
                        if: { $in: [userId, "$members"] },
                        then: true,
                        else: false
                    }
                },
                memberCount: {
                    $size: {
                        $ifNull: ["$members", []]
                    }
                },
            }
        },
        {
            $project: {
                groupName: 1,
                admin: 1,
                groupAvatar: 1,
                groupCoverImage: 1,
                isJoined: 1,
                memberCount: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]

    const allGroups = await Group.aggregatePaginate(Group.aggregate(pipeline), {
        page: pageNumber,
        limit: limitNumber
    })

    if (!allGroups) {
        throw new ApiError(500, "Any issue in fetching all groups")
    }

    return res.status(200)
        .json(new ApiResponse(200, allGroups, "Successfully fetched all groups"))
})

const checkIsRequestSent = asyncHandler(async (req, res) => {
    const { groupId } = req.params

    if(!isValidObjectId(groupId)){
        throw new ApiError(400, "Group Id is not valid")
    }

    const isSented = await Group.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(groupId) }
        },
        {
            $project: {
                isExistInRequest: {
                    $cond: {
                        if: { $in: [req.user._id, "$requestList"] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ])

    return res.status(200)
        .json(new ApiResponse(200, isSented[0]?.isExistInRequest, `Successfully check ${isSented[0]?.isExistInRequest ? " alread sended": " not sended"}`))
})

const isJoinedGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params

    const isJoinedOrNot = await Group.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(groupId) }
        },
        {
            $project: {
                isExistsInMemberList: {
                    $cond: {
                        if: { $in: [req.user._id, "$members"] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ])

    return res.status(200)
        .json(new ApiResponse(200, isJoinedOrNot[0]?.isExistsInMemberList, "Successfully get user joined or not"))
})

const getGroupById = asyncHandler(async (req, res) => {
    const { groupId } = req.params

    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "GroupID is not valid")
    }

    const groupDetails = await Group.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(groupId)
            }
        },
        {
            $addFields: {
                CurrentUserAdmin: {
                    $cond: {
                        if: { $eq: [req.user._id, "$admin"] },
                        then: true,
                        else: false
                    }
                },
                memberCount: {
                    $size: {
                        $ifNull: ["$members", []]
                    }
                }
            }
        },
        {
            $project: {
                requestList: 0,
                members: 0,
            }
        }
    ])

    return res.status(200)
        .json(new ApiResponse(200, groupDetails[0], "Successfully fetched group by id"))
})

const getAllMembersOfGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params

    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "GroupId is invalid")
    }

    const allMember = await Group.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(groupId)
            }
        },
        {
            $project: {
                members: 1
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "members",
                as: "members",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            isOnline: 1,
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
        .json(new ApiResponse(200, allMember[0], "Successfully get all members of group"))
})

const removeAMember = asyncHandler(async (req, res) => {
    const { memberId, groupId } = req.params

    if ([memberId, groupId].some((id) => !isValidObjectId(memberId))) {
        throw new ApiError(400, "Member or group ID is invalid")
    }

    const removedMember = await Group.findByIdAndUpdate(
        groupId,
        {
            $pull: {
                members: memberId
            }
        },
        { new: true }
    )


    if (!removedMember) {
        throw new ApiError("Any Issue in removing the person")
    }

    //remove groupId
    await User.findByIdAndUpdate(
        memberId,
        {
            $pull: {
                groups: groupId
            }
        }
    )

    return res.status(200)
        .json(new ApiResponse(200, removedMember, "Successfully removed"))
})

const rejectRequest = asyncHandler(async (req, res) => {
    const { groupId, requestUserId } = req.params

    if ([groupId, requestUserId].some((id) => !isValidObjectId(id))) {
        throw new ApiError(400, "Group or User Id is invalid")
    }

    const rejectedRequest = await Group.findByIdAndUpdate(
        groupId,
        {
            $pull: {
                requestList: requestUserId,
            }
        },
        { new: true }
    )

    if (!rejectedRequest) {
        throw new ApiError(500, "Any Issue in rejecting request")
    }

    return res.status(200)
        .json(new ApiResponse(200, true, "Successfully reject request"))
})

const getAllRequestOfGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params

    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "GroupId is invalid")
    }
    const allRequests = await Group.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(groupId)
            }
        },
        {
            $project: {
                requestList: 1,
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "requestList",
                as: "requests",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            isOnline: 1,
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
        .json(new ApiResponse(200, allRequests[0], "Successfully fetched all requests"))
})

const CheckCurrentlyUserInGroup = asyncHandler(async(req, res) => {
    const {groupId, userId} = req.params

    if([groupId, userId].some((id) => !isValidObjectId(id))){
        throw new ApiError(400, "Group or user ID is invalid")
    }

    const IsExists = await Group.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(groupId)
            }
        },
        {
            $project: {
                isExist: {
                    $cond: {
                        if: {$in: [new mongoose.Types.ObjectId(userId), "$members"]},
                        then: true,
                        else: false
                    }
                }
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200, IsExists[0], "Successfully check user is exist or not"))
})

export {
    createGroup,
    changeAdmin,
    deleteGroup,
    updateGroupAvatar,
    updateGroupCoverImage,
    addMemberInGroup,
    addRequestInGroup,
    getAllGroupsOfUser,
    searchGroupByName,
    getGroupById,
    checkIsRequestSent,
    isJoinedGroup,
    getAllMembersOfGroup,
    removeAMember,
    rejectRequest,
    getAllRequestOfGroup,
    CheckCurrentlyUserInGroup
}