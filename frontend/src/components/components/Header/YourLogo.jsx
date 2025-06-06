import { useSelector } from "react-redux"
import { Avatar } from "../../ui"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { LogoutBtn, ThemeBtn } from "."

export function YourLogo() {
    const [isHidden, setIsHidden] = useState(true)
    const [isLightOrDark, setIsLightOrDark] = useState("light")
    const userData = useSelector(state => state.user.userData)
    const navigate = useNavigate()

    const options = [
        {
            name: "View profile",
            slug: `/profile/${userData?.username}`
        },
        {
            name: "Change Password",
            slug: `/`
        }
    ]

    return (
        <div className="relative flex flex-col p-1 mx-auto text-white z-[9999]">
            <div
                className="cursor-pointer relative"
                onClick={() => setIsHidden(prev => !prev)}
            >
                {!isHidden && <div className="bg-[#0000006a] absolute top-0 left-0 z-[9999] h-full w-full grid place-items-center rounded-full text-[#fffb]">
                    <i className="ri-close-large-fill"></i>
                </div>}
                <Avatar
                    src={userData?.avatar}
                    alt="your avatar"
                    height="h-[40px] md:h-[45px]"
                    width="w-[40px] md:w-[45px]"
                    className="border"
                />
            </div>
            <div className={`${isHidden ? "hidden" : "absolute"} right-full top-full flex flex-col gap-3 text-sm sm:text-base text-center p-2 w-[200px] rounded-lg bg-[#000000b5] text-white z-[99999999]`}>
                <ul className="flex flex-col gap-2">
                    {options?.map((option) => (
                        <li
                            key={option.name}
                            className="cursor-pointer hover:bg-[#ffffff38] dark:hover:bg-[#5c5c5c34]"
                            onClick={() => {
                                setIsHidden(true)
                                navigate(option.slug)
                            }}
                        >
                            {option.name}
                        </li>
                    ))}
                    <li key={"theme"}>
                        {`${isLightOrDark.toUpperCase()} `}<ThemeBtn
                            setIsLightOrDark={setIsLightOrDark}
                        />
                    </li>
                    <li key={"logout"}>
                        <LogoutBtn />
                    </li>
                </ul>
            </div>
        </div>
    )
}