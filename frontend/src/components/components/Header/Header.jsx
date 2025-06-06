import { useLocation, useNavigate } from "react-router-dom";
import { SearchWithFilter, YourLogo, ThemeBtn } from ".";
import { Button, Logo } from "../../ui";
import { useSelector } from "react-redux";

export function Header({ searchInput, setSearchInput, setSearchType }) {
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = useSelector(state => state.user.isLogin)
    return (
        <header className="h-full w-full flex items-center justify-between">
            <div className="w-fit">
                <Logo />
            </div>
            <div className="w-auto mx-auto">
                {isLogin && <SearchWithFilter
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    setSearchType = {setSearchType}
                />}
            </div>
            <div>
                {!isLogin && location.pathname == "/register" &&
                    <Button 
                        value="Login"
                        onClick = {() => navigate("./login")}
                    />
                }
                {!isLogin && location.pathname == "/login" &&
                    <Button 
                        value="Register"
                        onClick = {() => navigate("./register")}
                    />
                }
            </div>
            <div className="absolute sm:static top-[7vh] right-2 min-[506px]:top-3 sm:right-3 md:right-6  h-fit w-fit">
                {isLogin && <YourLogo />}
            </div>
        </header>
    )
}