import toast from "react-hot-toast"
import { Button, Input, FormStyle, Error } from "../../ui"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { createAGroup } from "../../../services/group.service"
import { useNavigate } from "react-router-dom"

export function CreateGroup() {
    const [loading, setLoading] = useState(false)
    const { handleSubmit, register, formState: { errors } } = useForm()
    const navigate = useNavigate()

    const dataSubmit = async (data) => {
        setLoading(true)
        const formData = new FormData()
        formData.append("groupAvatar", data?.groupAvatar[0])
        formData.append("groupCoverImage", data?.groupCoverImage[0])
        formData.append("groupName", data?.groupName)

        await Promise.resolve(createAGroup({formData}))
        .then((res) => {
            if(res?.data?.data){
                toast.success("Successfully create a group")
                navigate('/') //todo
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }
    return (
        <div className="p-4">
            <FormStyle heading="Create Group">
                <form
                    onSubmit={handleSubmit(dataSubmit)}
                    className="w-full flex flex-col gap-4"
                >
                    {errors?.groupName && <Error message={errors.groupName.message} />}
                    <Input
                        placeholder="Group Name"
                        {...register('groupName', {
                            required: "Name is required",
                        })}
                    />
                    {errors?.groupAvatar && <Error message={errors.groupAvatar.message} />}
                    <Input
                        type="file"
                        accept = "image/*"
                        
                        label = "Avatar"
                        {...register('groupAvatar', {
                            required: "Avatar is required"
                        })}
                    />
                    {errors?.groupCoverImage && <Error message={errors.groupCoverImage.message} />}
                    <Input
                        type="file"
                        accept = "image/*"
                        label = "Coverimage"
                        {...register('groupCoverImage', {
                            required: "Coverimage is required"
                        })}
                    />
                    <Button
                        type="submit"
                        value="Create"
                        loading={loading}
                        icon={<i className="ri-upload-2-fill ml-1"></i>}
                    />
                </form>
            </FormStyle>
        </div>
    )
}