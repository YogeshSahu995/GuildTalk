import { Router } from "express";
import { addAComment, deleteAComment, getPostComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route('/add/:postId')
.post(addAComment)

router.route("/delete/:commentId")
.delete(deleteAComment)

router.route("/get/:postId")
.get(getPostComments)

export default router