import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    refreshAccessToken, 
    logoutUser, 
    getCurrentUser, 
    getProfileByUsername, 
    updateUserAvatar, 
    searchProfileByName,
    getUserDetailsById,
    updateUsername
} from "../controllers/user.controller.js";
import { uploader, verifyJWT } from "../middlewares/index.js"

const router = Router()

router.route("/register")
.post(
    uploader.single("avatar"), 
    registerUser
) 

router.route("/login")
.post(loginUser)

router.route("/logout")
.post(verifyJWT, logoutUser)

router.route("/refresh-token")
.post(refreshAccessToken)

router.route("/current-user")
.get(verifyJWT, getCurrentUser)

router.route("/get/profile/:username")
.get(verifyJWT, getProfileByUsername)

router.route("/update/avatar")
.patch(verifyJWT, uploader.single("avatar"), updateUserAvatar)

router.route("/update/username")
.patch(verifyJWT, updateUsername)

router.route("/search/profile")
.get(verifyJWT, searchProfileByName)

router.route("/get/details/:anotherUserId")
.get(verifyJWT, getUserDetailsById)


export default router
