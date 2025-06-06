import { forwardRef } from "react"

export const TextArea = forwardRef(({
    className = "",
    placeholder = "Type here...",
    border = "border-b border-b-[#0000006f] dark:border-b-[#ffffff66] outline-none",
    width = "w-full",
    rows = 1,
    ...props
}, ref) => {
    return (
        <textarea 
            className={`text-sm md:text-lg resize-none p-2 rounded w-auto ${border} ${width} `} 
            placeholder={placeholder}
            rows={rows}
            ref={ref}
            {...props}
        >
        </textarea>
    )
})