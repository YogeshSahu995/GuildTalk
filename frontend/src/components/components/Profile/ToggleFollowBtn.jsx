import { useState } from "react";
import { Button } from "../../ui";
import { toggleFollow } from "../../../services/follow.service";
import { useNavigate } from "react-router-dom";

export function ToggleFollowBtn({ isFollowing, userId, setIsFollowing, isCurrentUser }) {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const toggleHandler = async () => {
        setLoading(true)
        await Promise.resolve(toggleFollow({ anotherUserId: userId }))
            .then(res => setIsFollowing(res.data.data))
            .finally(() => setLoading(false))
    }

    return isCurrentUser ? (
        <Button
            value="Edit Profile"
            icon={<i className="ri-settings-5-line ml-1"></i>}
            onClick={() => navigate('/Edit/Profile')}
        />
    ) :
    (
        <Button
            value={isFollowing ? "Following" : "Follow"}
            icon={isFollowing ? <i className="ri-check-line ml-1"></i> : <i className="ri-shake-hands-line ml-1"></i>}
            backgroundColor={`${isFollowing ? "bg-[#9282a4] dark:bg-[#ff800169]" : "bg-[#aa63fc] dark:bg-[#ff8001]"} hover:bg-[#aa63fcd2] dark:hover:bg-[#ff8001d2]`}
            loading={loading}
            onClick={toggleHandler}
        />
    )
}