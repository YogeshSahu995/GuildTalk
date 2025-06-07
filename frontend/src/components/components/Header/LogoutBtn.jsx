import { useState } from "react";
import { Button } from "../../ui/Button/Button";
import { logoutUser } from "../../../services/user.service";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../socket";

export function LogoutBtn({
    className = ""
}) {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        setLoading(true)
        Promise.resolve(logoutUser())
            .then((res) => {
                if (res?.data?.data) {
                    dispatch(logout())
                    navigate('/login')
                    socket.disconnect() // connection disconnect here
                    toast("👋 Successfully logout")
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }
    return (
        <Button
            className={`${className} shadow-2xl`}
            textSize=""
            onClick={handleLogout}
            loading={loading}
            value="Logout"
            icon={<i className="ri-logout-box-r-line ml-1"></i>}
        />
    )
} 