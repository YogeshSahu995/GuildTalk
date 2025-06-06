import { useParams } from "react-router-dom";
import { Profile as ProfileComp } from "../components/components";
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { getProfileByUsername } from "../services/user.service";
import { BigLoader } from "../components/ui";

export function Profile() {
    const [loading, setLoading] = useState(false)
    const [profileData, setProfileData] = useState(null)
    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const { username } = useParams()
    const userData = useSelector(state => state?.user?.userData)

    useEffect(() => {
        setLoading(true)
        Promise.resolve(getProfileByUsername({ username }))
            .then((response) => {
                if (response?.data?.data) {
                    setProfileData(response?.data?.data)
                }
            })
            .finally(() => {
                if (userData?.username === username) {
                    setIsCurrentUser(true)
                }
                setLoading(false)
            })

    }, [username])

    if (loading || !profileData) return (<BigLoader />)

    return (
        <ProfileComp
            isCurrentUser={isCurrentUser}
            profileData={profileData}
        />
    )
}