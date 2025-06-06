import toast from "react-hot-toast";
import { addMemberInGroup } from "../../../../services/group.service";
import { Button } from "../../../ui";
import { useState } from "react";

export function AcceptBtn ({groupId, memberId, setIsDisapper}) {
    const [loading, setLoading] = useState(false)
    
    const handleAcceptRequest = () => {
        setLoading(true)
        Promise.resolve(addMemberInGroup({groupId, memberId}))
        .then(res => {
            if(res?.data?.data){
                setIsDisapper(true)
                toast.success("Successfully accept request 👍")
            }
        })
        .finally(() => setLoading(false))
    }

    return (
        <Button 
            value="Accept"
            loading={loading}
            icon={<i className="ri-check-line"></i>}
            onClick = {handleAcceptRequest}
        />
    )
} 