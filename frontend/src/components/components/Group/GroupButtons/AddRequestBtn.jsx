import { useEffect, useState } from "react";
import { Button } from "../../../ui";
import { addRequestInGroup, checkRequestIsSendedOrNot } from "../../../../services/group.service";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export function AddRequestBtn ({groupId}) {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const memberId = useSelector(state => state.user.userData?._id)

    useEffect(() => {
        if(groupId?.trim()){
            Promise.resolve(checkRequestIsSendedOrNot({groupId}))
            .then((res) => {
                if(res?.data?.data){
                    setSent(res.data.data)
                }
            })
        }
    }, [groupId])

    const handleAddRequest = () => {
        setLoading(true)
        Promise.resolve(addRequestInGroup({groupId, memberId}))
        .then((res) => {
            if(res?.data?.data){
                toast.success("Successfully sent request 📩")
                setSent(true)
            }
        })
        .finally(() => setLoading(false))
    }

    return (
        sent ? 
        (<Button
            value="Sended"
            backgroundColor="bg-[#b0b0b0bf] dark:bg-[#b0b0b0bf]"
            disabled
        />) : (<Button 
            loading={loading}
            value="Send Request"
            onClick = {handleAddRequest}
        />)
    )
}