import { Router } from "express";
import { verifyJWT, uploader } from "../middlewares/index.js";
import { uploadAPost, getProfilePosts, getPostDetails, deletePost } from "../controllers/post.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/upload/c")
.post(
    uploader.single("image"),
    uploadAPost
)

router.route("/delete/post/:postId")
.delete(deletePost)

router.route("/get/all/:profileId")
.get(getProfilePosts)

router.route("/get/post/details/:postId")
.get(getPostDetails)

export default router
