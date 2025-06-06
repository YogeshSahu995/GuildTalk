import { asyncHandler, ApiError, ApiResponse, uploadOnCloudinary, removeOnCloudinary } from "../utils/index.js"
import { User } from "../models/index.js"
import jwt from "jsonwebtoken"
import mongoose, { isValidObjectId } from "mongoose"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken // in database save refreshtoken 
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body

    if (
        [email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are compailsory and required")
    }

    const existedUser = await User.findOne({
        $or: [{ email: email }, { username: username }]
    })


    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar Image is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, "image")


    if (!avatar) {
        throw new ApiError(400, "avatar Image is required")
    }

    const user = await User.create({
        avatar: avatar.secure_url,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }
    const userDetails = await User.findOne({ $or: [{ username }, { email }] })

    if (!userDetails) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await userDetails.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Password is incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userDetails?._id)

    const user = await User.findByIdAndUpdate(userDetails?._id).select("-password -refreshToken")

    const options = {
        httpOnly: true, // it's protect from clientSide javascript from accessed it 
        secure: false,
        // sameSite: "none",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user, accessToken, refreshToken }, "user Logged In Successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            },
            $set: {
                isOnline: false,
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true, // javascript ma accessible nhi hoga
        secure: true, // agar ye true kerte hai cookie sirf https connection per send hogi only
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request!!!")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET) // {user info...}

        const user = await User.findById(decodedToken?._id).select("-password")
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: false
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { refreshToken }, "Access Token successfully refreshed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh Token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body
    const user = await User.findById(req.user?._id)

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "confirm Password is incorrect")
    }

    if (newPassword == oldPassword) {
        throw new ApiError(400, "This password is a recently used")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "old password is Invalid")
    }


    user.password = newPassword,

        await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password Changed successfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    const { username, email, socketId = "", _id, avatar } = req.user
    return res.status(200)
        .json(new ApiResponse(200, { username, email, socketId, _id, avatar }, "Successfully get current user"))
})

const getProfileByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params

    const profile = await User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "profile",
                as: "followers",
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "following",
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "owner",
                as: "posts",
            }
        },
        {
            $addFields: {
                isFollowed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$followers.follower"] },
                        then: true,
                        else: false
                    }
                },
                followersCount: {
                    $size: {
                        $ifNull: ["$followers", []]
                    }
                },
                followingCount: {
                    $size: {
                        $ifNull: ["$following", []]
                    }
                },
                postCount: {
                    $size: {
                        $ifNull: ["$posts", []]
                    }
                }
            }
        },
        {
            $project: {
                email: 1,
                username: 1,
                avatar: 1,
                followersCount: 1,
                followingCount: 1,
                isFollowed: 1,
                isOnline: 1,
                postCount: 1,
                createdAt: 1,
            }
        }
    ])

    if (!profile?.length) {
        throw new ApiError(404, "Profile is not exists")
    }

    return res.status(200)
        .json(new ApiResponse(200, profile[0], "Successfully get Profile by username"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError("userID is not valid")
    }
    
    const user = await User.findById(userId).select("avatar")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    if(avatar){
        await removeOnCloudinary(user?.avatar)
    }

    const updatedAvatar = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                avatar: avatar?.secure_url
            }
        },
        { new: true }
    ).select("_id username email avatar")

    if (!updatedAvatar) {
        throw new ApiError(500, "Any Issue updating avatar")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedAvatar, "Successfully update user avatar"))
})

const updateUsername = asyncHandler(async(req, res) => {
    const {username} = req.params

    if(!username.trim()){
        throw new ApiError(400, "Username is required")
    }

    const updatedUser = await User.updateOne(
        req.user._id,
        {
            $set: {username}
        },
        {new: true}
    )

    if(!updatedUser){
        throw new ApiError(500, "Any Issue in updating username")
    }

    return res.status(200)
    .json(new ApiResponse(200, updatedUser, "Successfully Upadte username"))
})

const searchProfileByName = asyncHandler(async (req, res) => {
    const { query, page = 1, limit = 10, } = req.query
    const pageNumber = Math.max(1, parseInt(page))
    const limitNumber = Math.max(1, parseInt(limit))

    const pipeline = [
        {
            $match: {
                ...(query ? {
                    username: {
                        $regex: query,
                        $options: "i"
                    }
                } : {})
            }
        },
        {
            $project: {
                email: 1,
                username: 1,
                avatar: 1,
                createdAt: 1,
            }
        }
    ]

    const allUsers = await User.aggregatePaginate(User.aggregate(pipeline), {
        page: pageNumber,
        limit: limitNumber
    })

    if (!allUsers) {
        throw new ApiError(500, "Any issue in fetching all users")
    }

    return res.status(200)
        .json(new ApiResponse(200, allUsers, "Successfully fetched all users"))
})

const getUserDetailsById = asyncHandler(async(req, res) => {
    const {anotherUserId} = req.params
    
    if(!isValidObjectId(anotherUserId)){
        throw new ApiError(400, "UserID is not valid")
    }

    const userDetails = await User.findById(anotherUserId).select("-password -refreshToken -groups")

    if(!userDetails){
        throw new ApiError(404, "User is not exists")
    }

    return res.status(200)
    .json(new ApiResponse(200, userDetails, "Successfully get User details"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    getProfileByUsername,
    updateUserAvatar,
    searchProfileByName,
    getUserDetailsById,
    updateUsername
}

