import { useSelector } from "react-redux";
import { removeTheMemberOfGroup } from "../../../../services/group.service";
import { Button, FormStyle, PopupFormStyle } from "../../../ui";
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
        <PopupFormStyle 
            isHideState={isExistFormHide}
            setIsHideState={setIsExistFormHide}
        >
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
        </PopupFormStyle>
    )
}