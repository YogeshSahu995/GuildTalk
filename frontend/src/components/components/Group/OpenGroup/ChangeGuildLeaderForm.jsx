import { useEffect, useState } from "react"
import { changeAdmin, getAllMembersOfGroup } from "../../../../services/group.service"
import toast from "react-hot-toast"
import { Avatar, Button } from "../../../ui"
import { useNavigate } from "react-router-dom"

export function ChangeGuildLeaderForm({
    groupId,
    currentAdminId,
    hideChangeForm,
    setHideChangeForm,
}) {
    const [allMember, setAllMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (groupId?.trim()) {
            Promise.resolve(getAllMembersOfGroup({ groupId }))
                .then((res) => {
                    if (res?.data?.data) {
                        setAllMembers(res.data.data.members)
                    }
                })
        }
    }, [groupId])

    const handleChangeGuildLeader = () => {
        Promise.resolve(changeAdmin({ adminId: selectedMember, groupId }))
            .then((res) => {
                if (res?.data?.data) {
                    toast.success("Successfully Change Admin")
                    setHideChangeForm(true)
                    navigate(`/group/${groupId}/members`)
                }
            })
    }

    return (
        <div className={`${hideChangeForm ? "hidden" : "absolute"} top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[70%] lg:w-1/2 bg-[#282828e8] dark:bg-[#000000d6] bg-blend-difference py-3 px-4 rounded z-[99999999] text-white`}>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-[#aa63fc] dark:text-[#ff8201] text-center mb-2">Change Admin</h1>
                <hr></hr>
                <div className="max-h-[50vh] min-h-fit overflow-y-auto">
                    <ul>
                        {allMember?.map((member) => {
                            if (currentAdminId !== member?._id) {
                                return (
                                    <li
                                        key={member?._id}
                                        className={`flex items-center justify-between h-fit hover:bg-[#111] mb-1 p-1 rounded-lg ${selectedMember === member?._id ? "bg-[#222]" : "bg-transparent"} cursor-pointer`}
                                        onClick={() => setSelectedMember(member?._id)}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <Avatar
                                                src={member?.avatar}
                                                height="h-[42px]"
                                                width="w-[42px]"
                                            />
                                            <p>{member?.username}</p>
                                        </div>
                                        {selectedMember === member?._id && (
                                            <i className="ri-check-line block text-[#aa63fc] dark:text-[#ff8201] text-xl font-bold mr-2"></i>
                                        )}
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>

                <i
                    className="ri-close-large-line absolute top-4 right-4 cursor-pointer"
                    onClick={() => setHideChangeForm(true)}
                ></i>

                <div className="flex justify-end">
                    <Button
                        value="Change"
                        onClick={handleChangeGuildLeader}
                    />
                </div>
            </div>
        </div>
    )
}