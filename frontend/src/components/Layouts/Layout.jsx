import { Header } from "../components/Header";
import { SideBar } from ".";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

export function Layout() {
    const [searchInput, setSearchInput] = useState("")
    const [searchType, setSearchType] = useState("Profile")
    const isLogin = useSelector(state => state?.user?.isLogin)
    const scrollContainer = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        if (searchInput?.trim()) {
            navigate("/")
        }
    }, [searchInput, searchType])
    return (
        <div className="h-[100dvh] w-[100vw] bg-[#E5D9F2] dark:bg-[#001F3F] overflow-x-hidden px-2 sm:px-4 md:px-5 lg:px-6">
            <section className="h-[10dvh] w-full md:border-b border-b-[#0000006f] dark:border-b-[#ffffff66]">
                <Header
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    setSearchType={setSearchType}
                />
            </section>
            <section className="h-[90dvh] flex flex-col-reverse md:flex-row flex-1/2">
                {isLogin && (
                    <aside className="h-fit md:h-full w-full md:w-fit md:pr-4 lg:w-[18%] border-t md:border-t-0 md:border-r border-[#00000091] dark:border-[#ffffff60]">
                        <SideBar />
                    </aside>
                )}
                <main
                    className="relative h-[85dvh] w-full overflow-x-hidden px-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-[#aa63fc] dark:scrollbar-thumb-[#ff8201]  scrollbar-track-[#25252529] dark:scrollbar-track-[#e0e0e029] scroll-smooth"
                    ref={scrollContainer}
                >
                    <Outlet
                        context={{
                            searchInput,
                            searchType,
                            scrollContainer: scrollContainer.current
                        }}
                    />
                </main>
            </section>
        </div>
    )
}