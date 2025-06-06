import { Button } from "../../../ui";
import { removeTheMemberOfGroup } from "../../../../services/group.service";
import toast from "react-hot-toast";
import { useState } from "react";

export function RemoveUserBtn({memberId, groupId, setIsDisapper}){
    const [loading, setLoading] = useState(false)

    const handleRemove = () => {
        setLoading(true)
        Promise.resolve(removeTheMemberOfGroup({memberId, groupId}))
        .then((res) => {
            if(res?.data?.data){
                setIsDisapper(true)
                toast.success("Successfully remove the member 💀")
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <Button 
            cursor="cursor-pointer"
            value= "Remove"
            loading={loading}
            onClick = {handleRemove}
        />
    )
}