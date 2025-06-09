export function HandelPreview({event, setTemp}) {
    const file = event?.target?.files[0]

    if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            setTemp(reader.result)
        }
    }
}