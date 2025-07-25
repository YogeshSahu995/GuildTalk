import { useEffect, useState } from "react"
import { useNavigate, useParams, Outlet } from "react-router-dom"
import { checkIsJoinedTheGroup, getGroupById } from "../../../../services/group.service"
import { Avatar, BigLoader, CoverImage, EmptyPage } from "../../../ui"
import { AddRequestBtn, MessageBtn } from "../GroupButtons"
import { ExitGroupForm, ChangeImageForm, ChangeGuildLeaderForm } from "../GroupForms"

export function OpenedGroup() {
    const [loading, setLoading] = useState(false)
    const [groupDetails, setGroupDetails] = useState({})
    const [typeForm, setTypeForm] = useState(null)
    const [isExistFormHide, setIsExistFormHide] = useState(true)
    const [hideChangeForm, setHideChangeForm] = useState(true)
    const [isHideChangeImageForm, setIsHideChangeImageForm] = useState(true)
    const [coverImage, setCoverImage] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [isJoined, setIsJoined] = useState(false)
    const [path, setPath] = useState("members")
    const { groupId } = useParams()
    const navigate = useNavigate()

    const options = [
        {
            name: "Members",
            value: "members",
            adminOnly: false,
        },
        {
            name: "Requests",
            value: "requests",
            adminOnly: true
        }
    ]

    useEffect(() => {
        setLoading(true)
        const controller = new AbortController()
        Promise.all([
            getGroupById({ groupId, signal: controller.signal }),
            checkIsJoinedTheGroup({ groupId, signal: controller.signal })
        ])
            .then(([res, res2]) => {
                if (res?.data?.data) {
                    setGroupDetails(res.data.data)
                    setCoverImage(res.data.data?.groupCoverImage)
                    setAvatar(res.data.data?.groupAvatar)
                }
                if (res2?.data?.data) {
                    setIsJoined(res2.data.data)
                }
            })
            .finally(() => {
                setLoading(false)
            })
        return () => controller.abort()
    }, [groupId])

    useEffect(() => {
        navigate(`./${path}`)
    }, [path])

    const toggleFormHiddenState = () => {
        if (groupDetails?.CurrentUserAdmin) {
            setHideChangeForm(false)
            setIsExistFormHide(true)
        }
        else {
            setHideChangeForm(true)
            setIsExistFormHide(false)
        }
    }
    if (loading) return <BigLoader />

    return (
        <div className="relative h-full">
            <ChangeImageForm
                type={typeForm}
                isHideChangeImageForm={isHideChangeImageForm}
                setIsHideChangeImageForm={setIsHideChangeImageForm}
                coverImage = {coverImage}
                setCoverImage={setCoverImage}
                avatar = {avatar}
                setAvatar = {setAvatar}
                groupId={groupDetails?._id}
            />
            <ExitGroupForm
                groupId={groupDetails?._id}
                isExistFormHide={isExistFormHide}
                setIsExistFormHide={setIsExistFormHide}
            />
            <ChangeGuildLeaderForm
                currentAdminId={groupDetails?.admin}
                groupId={groupDetails?._id}
                setHideChangeForm={setHideChangeForm}
                hideChangeForm={hideChangeForm}
            />
            <section
                className="h-fit relative mb-7 text-[#fff] p-2"
            >
                <CoverImage
                    src={coverImage}
                    alt="Group CoverImage"
                    className="relative mr-auto border brightness-75 border-[#0000006f] dark:border-[#ffffff66]"
                    width="w-[100%]"
                />
                <div className="absolute top-[50%] -translate-y-[50%] h-fit w-fit min-[250px]:w-[97%] p-2 mx-auto flex flex-col sm:flex-row justify-between items-center z-10">
                    <div className="flex flex-wrap justify-center items-center gap-2">
                        <div className="w-fit relative">
                            <div
                                className="absolute h-full w-full flex justify-center items-center cursor-pointer opacity-0 duration-200 hover:opacity-100 z-10 bg-[#00000028] rounded-full"
                                onClick={() => {
                                    setIsHideChangeImageForm(prev => !prev)
                                    setTypeForm("avatar")
                                }}
                            >
                                <i className="ri-camera-line text-[20px]"></i>
                            </div>
                            <Avatar
                                src={avatar}
                                alt="Group Avatar"
                                height="h-[70px] sm:h-[80px] md:h-[90px]"
                                width="w-[70px] sm:w-[80px] md:w-[90px]"
                                className="border border-[#0000006f] dark:border-[#ffffff66]"
                            />
                        </div>
                        <h3 className="italic text-lg sm:text-xl md:text-2xl">{groupDetails?.groupName}</h3>
                    </div>
                    {
                        isJoined ?
                            <MessageBtn
                                groupId={groupDetails?._id}
                                className={`z-40`}
                            /> :
                            <AddRequestBtn
                                groupId={groupDetails?._id}
                            />
                    }
                </div>
                <div className="absolute top-5 sm:top-3 right-6 w-fit flex gap-1 items-center cursor-pointer z-20">
                    <div
                        className="cursor-pointer duration-200"
                        onClick={() => {
                            setIsHideChangeImageForm(prev => !prev)
                            setTypeForm("coverImage")
                        }}
                    >

                        <i className="ri-image-add-fill"></i>
                    </div>
                    <div onClick={toggleFormHiddenState}>
                        {
                            isJoined && (groupDetails?.CurrentUserAdmin ?
                                (<p className="md:text-lg">
                                    <i className="ri-user-settings-line"></i>
                                </p>) :
                                (<p className="md:text-lg">
                                    <i className="ri-logout-circle-r-line ml-1"></i>
                                </p>))
                        }
                    </div>

                </div>
                <div className="absolute bottom-3 right-6">
                    <p className="text-xs md:text-lg">
                        <i className="ri-group-fill mr-1"></i>
                        {groupDetails?.memberCount}
                    </p>
                </div>
            </section>
            {
                isJoined ? (
                    <section>
                        <select
                            className="p-1 m-2 outline-none border rounded-2xl cursor-pointer"
                            defaultValue="members"
                            onChange={(e) => setPath(e.target.value)}
                        >
                            {options?.map(({ name, value, adminOnly }) => (
                                <option
                                    className="bg-[#a8a8a8] dark:bg-[#4d4d4d]"
                                    value={value}
                                    disabled={adminOnly && !groupDetails?.CurrentUserAdmin}
                                    key={value}
                                >
                                    {adminOnly && !groupDetails?.CurrentUserAdmin && "🔒"}
                                    {name}
                                </option>
                            ))}
                        </select>
                        <Outlet
                            context={{
                                groupId: groupId,
                                adminId: groupDetails?.admin,
                                CurrentUserAdmin: groupDetails?.CurrentUserAdmin
                            }}
                        />
                    </section>
                ) :
                    (
                        <section>
                            <EmptyPage
                                heading="🚫 Group Access Restricted"
                                firstMessage="Oops! You need to join the group to see the content"
                                secondMessage="Membership required to interact and view messages."
                            />
                        </section>
                    )
            }
        </div>
    )
}