import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, updateAvatar, updateUsername } from "../../../services/user.service";
import { Button, Input, FormStyle, Error, Avatar } from "../../ui";
import { useForm } from "react-hook-form";
import { login } from "../../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { HandelPreview } from "../../../utils/previewHandler";
import toast from "react-hot-toast";

export function Register({ prevData }) {

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            avatar: prevData?.avatar || "",
            username: prevData?.username || "",
            email: prevData?.email || "",
            password: prevData?.password || "",
        }
    })

    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const dataSubmit = (data) => {
        setLoading(true)
        if (!prevData) {
            const { username, avatar, email, password } = data
            const formData = new FormData()
            formData.append("username", username);
            formData.append("avatar", avatar?.[0]);
            formData.append("email", email);
            formData.append("password", password);

            //register
            Promise.resolve(registerUser({ formData }))
                .then((res) => {
                    if (res?.data?.data) {
                        Promise.resolve(loginUser({ username, password }))
                            .then((res) => {
                                if (res?.data?.data?.user) {
                                    socket.connect() //create Connection
                                    socket.emit("user-online", { userId: response?.data?.data?.user?._id }) //set socket.id and isOnline: true
                                    dispatch(login(response.data.data.user))
                                    toast.success("Successfully registered 👍")
                                    navigate('/')
                                }
                            })
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        else {
            const { username, avatar } = data
            const formData = new FormData()
            formData.append("avatar", avatar?.[0])

            //edit profile
            if (username !== prevData?.username) {
                Promise.all([updateUsername({ username: prevData?.username }), updateAvatar({ formData })])
                    .then(([res, res2]) => {
                        if (res?.data?.data && res2?.data?.data) {
                            navigate(`/profile/${res.data.data.username}`)
                            toast.success("Successfully update Profile")
                            setLoading(false)
                        }
                    })
            }
            else {
                Promise.resolve(updateAvatar({ formData }))
                    .then((res) => {
                        if (res?.data?.data) {
                            navigate(`/profile/${res.data.data.username}`)
                            toast.success("Successfully Change Avatar")
                            setLoading(false)
                        }
                    })

            }
        }
    }

    return (
        <div className="p-4">
            <FormStyle heading={`${prevData ? "Edit Profile" : "Register"}`}>
                <form
                    onSubmit={handleSubmit(dataSubmit)}
                    className="w-full flex flex-col"
                >
                    {errors?.username && <Error message={errors?.username?.message} />}
                    <Input
                        label="Username"
                        placeholder="Enter username"
                        {...register('username', {
                            required: "username is required",
                        })}
                    />
                    {errors?.email && <Error message={errors?.email?.message} />}
                    {!prevData && <Input
                        type="email"
                        placeholder="Enter email"
                        {...register('email', {
                            required: "email is required"
                        })}
                    />}

                    {errors?.avatar && <Error message={errors?.avatar?.message} />}

                    {avatar? <Avatar
                        src={avatar}
                        margin="mx-auto mb-1"
                    />: (prevData?.avatar && <Avatar src={prevData.avatar} margin="mx-auto mb-1"/>)}

                    

                    <Input
                        type="file"
                        label="Upload Avatar"
                        accept="image/*"
                        onInput={(e) => HandelPreview({ event: e, setTemp: setAvatar })}
                        {...register("avatar", {
                            required: "avatar is required"
                        })}
                    />

                    {errors?.password && <Error message={errors?.password?.message} />}
                    {!prevData && <Input
                        placeholder="Enter password"
                        {...register('password', {
                            required: "password is required",
                        })}
                    />}
                    <Button
                        type="submit"
                        value={prevData ? "Edit" : "Register"}
                        loading={loading}
                        icon={<i className="ri-quill-pen-line ml-1"></i>}
                    />
                </form>
                {!prevData && <p className="font-semibold mt-2">
                    You have an account ?
                    <Link to='/Login' className="text-[#A594F9] hover:text-[#a594f9df] dark:text-[#ff8201] dark:hover:text-[#ff8001d2]">
                        _Login Page_
                    </Link>
                </p>}

            </FormStyle>
        </div>
    )
}