import { Router } from "express";
import { saveTheMessage, getAllMessages, deleteAMessage, saveTheGroupMessage, getAllMessagesOfGroup, getAllCommunicatedProfiles, getLastMessageOfGroup } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/index.js";

const router = Router()

router.use(verifyJWT)

router.route("/save/:senderId/:receiverId")
.post(saveTheMessage)

router.route("/group/save/:senderId/:groupId")
.post(saveTheGroupMessage)

router.route("/get/messages/group/:groupId")
.get(getAllMessagesOfGroup)

router.route("/get/messages/:anotherUserId")
.get(getAllMessages)

router.route("/delete/message/:messageId")
.delete(deleteAMessage)

router.route("/get/profiles")
.get(getAllCommunicatedProfiles)

router.route("/get/group/latest/message/:groupId")
.get(getLastMessageOfGroup)

export default router