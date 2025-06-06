import toast from "react-hot-toast"
import { uploadAPost } from "../../../services/post.service"
import { Button, Input, FormStyle, Error } from "../../ui"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export function CreatePost() {
    const [loading, setLoading] = useState(false)
    const { handleSubmit, register, formState: { errors } } = useForm()
    const username = useSelector(state => state?.user?.userData?.username)
    const navigate = useNavigate()

    const dataSubmit = async (data) => {
        setLoading(true)

        const formData = new FormData()
        formData.append("image", data?.image[0])
        formData.append("caption", data?.caption)
        Promise.resolve(uploadAPost({ formData }))
            .then((res) => {
                if (res?.data?.data) {
                    toast.success("Successfully Upload")
                    navigate(`/profile/${username}`)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }
    return (
        <div className="p-4">
            <FormStyle heading="Create Post">
                <form
                    onSubmit={handleSubmit(dataSubmit)}
                    className="w-full flex flex-col gap-4"
                >
                    {errors?.image && <Error message={errors.image.message} />}
                    <Input
                        type="file"
                        accept="image/*"
                        {...register('image', {
                            required: "Image is required"
                        })}
                    />
                    {errors?.caption && <Error message={errors.cation.message} />}
                    <Input
                        placeholder="Write caption..."
                        {...register('caption', {
                            required: "Caption is required",
                        })}
                    />
                    <Button
                        type="submit"
                        value="Upload"
                        loading={loading}
                        icon={<i className="ri-upload-2-fill ml-1"></i>}
                    />
                </form>
            </FormStyle>
        </div>
    )
}