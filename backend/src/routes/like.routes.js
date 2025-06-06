import { Router } from "express";
import {verifyJWT} from '../middlewares/index.js'
import { togglePostLike, getLikedPost, getPostLikes } from "../controllers/like.controller.js";

const router = Router()

router.use(verifyJWT)
router.route("/toggle/:postId")
.post(togglePostLike)

router.route("/get/liked-post")
.get(getLikedPost)

router.route("/get/likes/:postId")
.get(getPostLikes)

export default router