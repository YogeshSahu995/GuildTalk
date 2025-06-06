import { Router } from "express";
import { verifyJWT, uploader } from "../middlewares/index.js";
import { 
    addMemberInGroup,
    addRequestInGroup,
    changeAdmin, 
    createGroup, 
    deleteGroup, 
    searchGroupByName, 
    getAllGroupsOfUser, 
    updateGroupAvatar, 
    updateGroupCoverImage,
    getGroupById,
    checkIsRequestSent,
    isJoinedGroup,
    getAllMembersOfGroup,
    removeAMember,
    getAllRequestOfGroup,
    rejectRequest,
    CheckCurrentlyUserInGroup
} from "../controllers/group.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/create/guild")
.post(uploader.fields([
        { name: "groupAvatar", maxCount: 1 },
        { name: "groupCoverImage", maxCount: 1 }
    ]),
        createGroup
    )

router.route("/change/admin/:adminId/:groupId")
.patch(changeAdmin)

router.route("/delete/guild/:groupId")
.delete(deleteGroup)

router.route("/update/avatar/guild/:groupId")
.patch(uploader.single("groupAvatar"), updateGroupAvatar)

router.route("/update/cover-image/guild/:groupId")
.patch(uploader.single("groupCoverImage"), updateGroupCoverImage)

router.route("/get/all/guild")
.get(getAllGroupsOfUser)

router.route('/req/guild/:groupId/:memberId')
.post(addRequestInGroup)

router.route("/add/guild/:groupId/:memberId")
.post(addMemberInGroup)

router.route("/search/all/guild")
.get(searchGroupByName)

router.route("/get/group/details/:groupId")
.get(getGroupById)

router.route("/get/already/request/:groupId")
.get(checkIsRequestSent)

router.route("/get/join/details/:groupId")
.get(isJoinedGroup)

router.route("/get/all/member/:groupId")
.get(getAllMembersOfGroup)

router.route("/remove/member/:memberId/:groupId")
.patch(removeAMember)

router.route("/get/all/requests/:groupId")
.get(getAllRequestOfGroup)

router.route("/reject/request/user/:requestUserId/:groupId")
.patch(rejectRequest)

router.route("/check/user/exist/:userId/:groupId")
.get(CheckCurrentlyUserInGroup)

export default router