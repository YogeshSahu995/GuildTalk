import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/user.service";
import { Button, Input, FormStyle, Error } from "../../ui";
import { useForm } from "react-hook-form";
import { login } from "../../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { socket } from "../../../socket";

export function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const dataSubmit = ({ username, password }) => {
        setLoading(true)
        if (!(username.trim() && password)) return

        Promise.resolve(loginUser({ username, password }))
            .then((response) => {
                if (response?.data?.data?.user) {
                    socket.connect() //create connection
                    socket.emit("user-online", { userId: response?.data?.data?.user?._id })//set socketID and isOnline state
                    dispatch(login(response.data.data.user))
                    navigate('/')
                }
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className="p-4">
            <FormStyle heading="Login">
                <form
                    onSubmit={handleSubmit(dataSubmit)}
                    className="w-full flex flex-col gap-4"
                >
                    {errors?.username && <Error message={errors.username.message} />}
                    <Input
                        placeholder="Enter username"
                        {...register('username', {
                            required: "username is required",
                        })}
                    />
                    {errors?.password && <Error message={errors.password.message} />}
                    <Input
                        placeholder="Enter password"
                        {...register('password', {
                            required: "password is required",
                        })}
                    />
                    <Button
                        type="submit"
                        value="Login"
                        loading={loading}
                        icon={<i className="ri-login-box-line ml-1"></i>}
                    />
                </form>
                <p className="font-semibold mt-2">
                    Don't have an account ?
                    <Link to='/register' className="text-[#A594F9] hover:text-[#a594f9df] dark:text-[#ff8201] dark:hover:text-[#ff8001d2]">
                        _Create Account_
                    </Link>
                </p>

            </FormStyle>
        </div>
    )
}