import { Router } from "express";
import { getAllFollower, getAllFollowingProfile, isFollowed, toggleFollow } from "../controllers/follow.controller.js";
import { verifyJWT } from "../middlewares/index.js";

const router = Router()

router.use(verifyJWT)

router.route("/toggle/:anotherUserId")
.post(toggleFollow)

router.route("/get/followers/:username")
.get(getAllFollower)

router.route("/get/following/:username")
.get(getAllFollowingProfile)

router.route("/is/followed/:profileId")
.get(isFollowed)

export default router