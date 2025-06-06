import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export function SideBar(){
    const username = useSelector(state => state?.user?.userData?.username)
    const navigate = useNavigate()
    const navItems = [
        {
            name: "Home",
            slug: "/",
            icon: <i className="ri-home-2-line"></i>
        },
        {
            name: "Profile",
            slug: `/profile/${username}`,
            icon: <i className="ri-user-3-line"></i>
        },
        {
            name: "Group",
            slug: "/all/groups",
            icon: <i className="ri-team-fill"></i>
        },
        {
            name: "Post",
            slug: "/Create/post/form",
            icon: <i className="ri-image-add-fill"></i>
        },
        {
            name: "Chats",
            slug: '/messages',
            icon: <i className="ri-chat-1-line"></i>
        }
    ]
    return (
        <nav className="h-full w-full">
            <ul className="h-full w-full flex flex-row md:flex-col justify-around items-center md:items-start">
                {navItems?.map(({name, slug, icon}) => (
                    <li 
                        key={name} 
                        onClick={() => navigate(slug)}
                        className="p-2 text-xl text-left cursor-pointer hover:bg-[#f1e8ff] hover:dark:bg-[#3a6d8c58] hover:shadow-2xl rounded-xl duration-200"
                    > 
                        <div className="w-fit flex gap-2 md:w-[90%]">
                            <span>{icon}</span>
                            <span className="hidden md:inline text-nowrap">{name}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    )
}