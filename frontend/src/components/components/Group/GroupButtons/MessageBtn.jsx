import { Button } from "../../../ui"
import { useNavigate } from "react-router-dom"

export function MessageBtn({groupId, className = ""}) {
    const navigate = useNavigate()
    return (
        <Button
            value="Message"
            className = {`${className}`}
            icon={<i className="ri-arrow-right-down-line"></i>}
            onClick={(e) => {
                e.stopPropagation() // stops the event from reaching the parent.
                navigate(`/group/message/to/${groupId}`)
            }}
        />
    )
}