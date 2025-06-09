import { Avatar, Button, CoverImage, Input, PopupFormStyle } from "../../../ui"
import { HandelPreview } from "../../../../utils/previewHandler"
import { useForm } from "react-hook-form"
import { useCallback, useState } from "react"
import { changeGroupAvatar, changeGroupCoverImage } from "../../../../services/group.service"

export function ChangeImageForm({
    type,
    isHideChangeImageForm,
    setIsHideChangeImageForm,
    coverImage,
    setCoverImage,
    avatar,
    setAvatar,
    groupId
}) {
    const [loading, setLoading] = useState(false)
    const [temp, setTemp] = useState(null)
    const { register, handleSubmit } = useForm()
    console.log(type)

    //change cover-image
    const handelChangeImage = useCallback((data) => {
        setLoading(true)
        const formData = new FormData()
        if (type === "coverImage") {
            formData.append("groupCoverImage", data?.groupCoverImage[0])
            Promise.resolve(changeGroupCoverImage({ groupId, data: formData }))
                .then((res) => {
                    if (res?.data?.data) {
                        setCoverImage(res.data.data)
                        setIsHideChangeImageForm(true)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        else {
            formData.append("groupAvatar", data?.groupAvatar[0])
            Promise.resolve(changeGroupAvatar({ groupId, data: formData }))
                .then((res) => {
                    if (res?.data?.data) {
                        setAvatar(res.data.data)
                        setIsHideChangeImageForm(true)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [type, groupId])

    return (
        <PopupFormStyle
            isHideState={isHideChangeImageForm}
            setIsHideState={setIsHideChangeImageForm}
        >
            <form
                onSubmit={handleSubmit(handelChangeImage)}
                className="flex gap-1 flex-col"
            >
                {type === "coverImage" ?
                    <CoverImage
                        src={temp? temp: coverImage}
                    /> :
                    <Avatar
                        margin="mx-auto"
                        src={temp? temp: avatar}
                    />
                }
                <Input
                    type="file"
                    onInput={(event) => {
                        HandelPreview({ event, setTemp })
                    }}
                    {...register(`${type === "coverImage" ? "groupCoverImage" : "groupAvatar"}`, {
                        required: true,
                    })}
                />
                <Button
                    loading={loading}
                    value={`Change ${type === "coverImage" ? "coverImage" : "avatar"}`}
                    type="submit"
                    icon={<i className="ri-camera-line"></i>}
                />
            </form>
        </PopupFormStyle>
    )
}