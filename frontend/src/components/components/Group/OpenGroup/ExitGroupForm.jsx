import { useSelector } from "react-redux";
import { removeTheMemberOfGroup } from "../../../../services/group.service";
import { Button, FormStyle } from "../../../ui";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function ExitGroupForm({ isExistFormHide, setIsExistFormHide, groupId }) {
    const userId = useSelector((state) => state?.user?.userData?._id)
    const navigate = useNavigate()

    const handleExitTheGroup = () => {
        Promise.resolve(removeTheMemberOfGroup({ memberId: userId, groupId }))
            .then((res) => {
                if (res?.data?.data) {
                    toast.success("Successfully exist from the group")
                    setIsExistFormHide(true)
                    navigate("/all/groups")
                }
            })
    }

    return (
        <div className={`${isExistFormHide ? "hidden" : "absolute"} top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[70%] lg:w-1/2 bg-[#282828e8] dark:bg-[#000000d6] bg-blend-difference py-3 px-4 rounded z-50`}>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-[#aa63fc] dark:text-[#ff8201]">Are you sure?</h1>
                <p className="font-semibold text-gray-300">Are you sure to Exit from the group.</p>
                <div className="flex justify-end gap-2">
                    <Button
                        value="Exit"
                        onClick={handleExitTheGroup}
                    />
                </div>
            </div>
            <i
                className="ri-close-large-line absolute top-4 right-4 cursor-pointer"
                onClick={() => setIsExistFormHide(true)}
            ></i>
        </div>
    )
}