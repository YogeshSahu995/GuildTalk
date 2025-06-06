import { Loader } from ".."

const Button = ({
    value,
    icon,
    loading,
    type = "button",
    className = "",
    backgroundColor = "bg-[#aa63fc] dark:bg-[#ff8201] hover:bg-[#aa63fcd2] dark:hover:bg-[#ff8001d2]",
    cursor = "cursor-pointer",
    textColor = "text-[#fff]",
    textSize = "text-sm sm:text-base md:text-lg",
    ...props
}) => {
    return (
        <button 
            type={type}
            className={`font-semibold m-0.5 rounded-xl border-none px-3 py-1 z-[99] ${textSize} ${textColor} ${loading? "wait" : cursor} ${className} ${backgroundColor}`}
            disabled = {loading}
            {...props}
        >
            {value}
            {(!loading && icon) && icon}
            {loading && <Loader height="h-[16px]" widht="w-[16px]"/>}
        </button>
    )
}

export {Button}