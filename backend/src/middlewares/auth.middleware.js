import { User } from "../models/user.model.js"
import { ApiError, asyncHandler } from "../utils/index.js"
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const accessToken =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!accessToken){
            throw new ApiError(401, "unauthorized request")
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401, error.message)
    }
} )