import { forwardRef } from "react" 

const Input = forwardRef((
    {
        label = "",
        type = "text",
        placeholder = "",
        className = "",
        margin = "mb-2",
        padding = "px-2 py-1",
        text= "sm:text-md md:text-lg",
        width = "w-[100%]",
        ...props
    }, ref
) => {
    return (
        <>
            {label && <label className="text-xl font-semibold mb-1">{label}</label>}
            <input
                type={type}
                placeholder = {placeholder}
                ref={ref}
                className= {`border border-[#0000006f] dark:border-[#ffffff66] outline-none rounded-lg ${className} ${width} ${margin} ${padding} ${text}`}
                {...props}
            />
        </>
    )
})

export {Input}