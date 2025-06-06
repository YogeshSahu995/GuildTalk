import { useState } from "react"
import { rejectRequestOfUser } from "../../../../services/group.service"
import { Button } from "../../../ui"
import toast from "react-hot-toast"

export function RejectBtn({groupId, memberId, setIsDisapper}){
    const [loading, setLoading] = useState(false)

    const handleRejectRequest = () => {
        setLoading(true)
        Promise.resolve(rejectRequestOfUser({groupId, requestUserId: memberId}))
        .then((res) => {
            if(res?.data?.data){
                setIsDisapper(true)
                toast.success("Successfully reject the request 😏")
            }
        })
        .finally(() => setLoading(false))
    }

    return (
            <Button 
                value="Reject"
                icon={<i className="ri-close-line"></i>}
                backgroundColor="bg-red-500"
                onClick = {handleRejectRequest}
                loading={loading}
            />
    )
}