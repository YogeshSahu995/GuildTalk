import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import {useSelector} from "react-redux";

export default function AuthLayout({authentication = true, children}){
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.user.status)

    useEffect(() => {
        if(authentication && authStatus){
            navigate("/")
        }
        if(!authentication && !authStatus){
            navigate("/login")
        }
        setLoader(false)
    }, [authStatus, authentication])

    return !loader && (children)

}