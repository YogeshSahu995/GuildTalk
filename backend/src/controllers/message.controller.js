import mongoose, { isValidObjectId } from "mongoose";
import { Message } from "../models/message.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { User } from "../models/user.model.js";
import { io } from "../app.js";
import { Group } from "../models/group.model.js";

const saveTheMessage = asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.params
    const { message, messageType } = req.body

    if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
        throw new ApiError(400, "Sender or receiver is not an valid id")
    }

    if (!message?.trim()) {
        throw new ApiError(400, "Not send any blank message to user")
    }

    const user = await User.findById(receiverId)
    const anotherUser = await User.findById(senderId)

    if(user?.socketId){
        io.to(user?.socketId).emit('receiveMessage', {
            messageType,
            senderId, 
            message, 
            username: anotherUser?.username
        })
    }

    const sendedMessage = await Message.create({
        senderId,
        receiverId,
        message,
    })

    if (!sendedMessage) {
        throw new ApiError(500, "An Issue in creating sendedMessage document")
    }

    return res.status(200)
        .json(new ApiResponse(200, sendedMessage, "Successfully save a message"))
})

const saveTheGroupMessage = asyncHandler(async (req, res) => {
    const { message, messageType } = req.body
    const { groupId } = req.params
    const senderId = req.user?._id

    if ([senderId, groupId].some((field) => !isValidObjectId(field))) {
        throw new ApiError(400, "Sender or group is not an valid id")
    }

    if (!message?.trim()) {
        throw new ApiError(400, "Not send any blank message to user")
    }

    const sendedMessage = await Message.create({
        senderId,
        groupId,
        message,
    })

    const allMembers = await Group.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(groupId),
            }
        },
        {
            $project: {
                members: 1,
                groupName: 1
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
                            socketId: 1,
                            username: 1,
                        }
                    }
                ]
            }
        }
    ])

    const senderDetails = await User.findById(senderId).select("username _id ")

    //send the message to all users of the group
    if(allMembers[0]?.members){
        allMembers[0]?.members?.map((user) => {
            if(user?.socketId && user?._id !== senderId){
                io.to(user?.socketId).emit('receiveMessage', {
                    messageType,
                    senderId, 
                    senderUsername: senderDetails?.username, 
                    groupId, 
                    message, 
                    username: allMembers[0]?.groupName
                })
            }
        })
    }


    if (!sendedMessage) {
        throw new ApiError(500, "An Issue in creating sendedMessage document")
    }

    return res.status(200)
        .json(new ApiResponse(200, sendedMessage, "Successfully save a message"))
})

const getAllMessagesOfGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params
    const { page = 1, limit = 20 } = req.query

    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "group Id is invalid")
    }

    const pageNumber = Math.max(1, parseInt(page))
    const limitNumber = Math.max(1, parseInt(limit))

    const pipeline = [
        {
            $match: {
                groupId: new mongoose.Types.ObjectId(groupId)
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "senderId",
                as: "senderDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1
                        }
                    },
                ]
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]

    const options = {
        page: pageNumber,
        limit: limitNumber
    };

    const allMessages = await Message.aggregatePaginate(Message.aggregate(pipeline), options)

    if (!allMessages) {
        throw new ApiError(500, "Any problem in fetching messages of Group")
    }

    return res.status(200)
        .json(new ApiResponse(200, allMessages, "Successfully fetched messages of Group"))
})

const getAllMessages = asyncHandler(async (req, res) => {
    const { anotherUserId } = req.params
    const { page = 1, limit = 20 } = req.query
    const userId = req.user?._id

    if (!isValidObjectId(anotherUserId)) {
        throw new ApiError(400, "Another User Id is invalid")
    }

    const pageNumber = Math.max(1, parseInt(page))
    const limitNumber = Math.max(1, parseInt(limit))

    const pipeline = [
        {
            $match: {
                $or: [
                    {
                        senderId: userId,
                        receiverId: new mongoose.Types.ObjectId(anotherUserId)
                    },
                    {
                        senderId: new mongoose.Types.ObjectId(anotherUserId),
                        receiverId: userId
                    }
                ]
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]

    const options = {
        page: pageNumber,
        limit: limitNumber
    };

    const allMessages = await Message.aggregatePaginate(Message.aggregate(pipeline), options)

    if (!allMessages) {
        throw new ApiError(500, "Any problem in fetching messages")
    }

    return res.status(200)
        .json(new ApiResponse(200, allMessages, "Successfully fetched messages"))
})

const deleteAMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(messageId)) {
        throw new ApiError(400, "Another User Id is invalid")
    }

    const isOwner = await Message.findOne({ _id: messageId, senderId: userId })

    if (!isOwner) {
        throw new ApiError(400, "You are not an owner of this comment")
    }

    const deletedmessage = await Message.deleteOne({ _id: messageId, senderId: userId })

    if (!deletedmessage) {
        throw new Error("Any issue in deleting the message")
    }

    res.status(200)
        .json(new ApiResponse(200, deletedmessage, "Successfully delete the message"))

})

const getAllCommunicatedProfiles = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const allMessages = await Message.aggregate([
        {
            $match: {
                $or: [
                    { senderId: new mongoose.Types.ObjectId(userId) },
                    { receiverId: new mongoose.Types.ObjectId(userId) },
                ]
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 0,
                otherUserId: {
                    $cond: {
                        if: {
                            $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] //check
                        },
                        then: "$receiverId",
                        else: "$senderId"
                    }
                },
                groupId: 1,
                message: 1,
                createdAt: true,
            }
        },
        {
            $facet: {
                userProfiles: [
                    { $match: { otherUserId: { $ne: null } } },
                    { $group: { 
                        _id: "$otherUserId",
                        latestMessage: {$first: "$message"} ,
                        createdAt:{$first: "$createdAt"}
                    }},
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "profile",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,
                                        _id: 1,
                                        isOnline: 1,
                                    }
                                },
                            ]
                        }
                    },
                    { $unwind: "$profile" },
                    { $addFields: {message: "$message"}},
                ],

                groups: [
                    { $match: { groupId: { $ne: null } } },
                    { $group: { 
                        _id: "$groupId",
                        latestMessage: {
                            $first: "$message"
                        },
                        createdAt: {
                            $first: "$createdAt"
                        }
                    } },
                    {
                        $lookup: {
                            from: "groups",
                            localField: "_id",
                            foreignField: "_id",
                            as: "group",
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
                                                    _id: 1,
                                                }
                                            }
                                        ]
                                    },
                                },
                                {
                                    $addFields: {
                                        memberCount: { $size: "$members" },
                                    },
                                },
                                {
                                    $project: {
                                       groupName: 1,
                                       admin: 1,
                                       groupAvatar: 1,
                                       groupCoverImage: 1,
                                       memberCount: 1,
                                   },

                                }
                            ]
                        }
                    },
                    { $unwind: "$group" },
                ]
            }
        }
    ])

    return res.status(200)
        .json(new ApiResponse(200, allMessages[0], "Successfully get all messages"))
})

const getLastMessageOfGroup = asyncHandler(async(req, res) => {
    const {groupId} = req.params

    if(!isValidObjectId(groupId)){
        throw new ApiError(400, "Group Id is invalid")
    }

    const lastMessage = await Message.findOne({groupId}).sort({createdAt: -1})

    if(!lastMessage){
        throw new ApiError(500, "Any Issue in get latest message")
    }

    return res.status(200)
    .json(new ApiResponse(200, lastMessage.message, "Successfully Get Latest Message"))
})


//$group: collects unique receiverIds.



export { 
    saveTheMessage, 
    saveTheGroupMessage, 
    getAllMessagesOfGroup, 
    getAllMessages, 
    deleteAMessage, 
    getAllCommunicatedProfiles,
    getLastMessageOfGroup
}
