import { useSelector } from "react-redux"
import {Register} from "../components/components"

export function EditProfilePage(){
    const userData = useSelector(state => state.user.userData)

    return (<Register prevData={{username: userData?.username, avatar: userData?.avatar}}/>)
}