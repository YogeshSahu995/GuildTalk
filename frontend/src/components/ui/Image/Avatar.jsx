export function Avatar({
    src = null,
    alt = "avatar",
    className = "",
    margin = "",
    height = "h-[50px] sm:h-[60px] md:h-[70px]",
    width = "w-[50px] sm:w-[60px] md:w-[70px]",
    isOnline = false,
}) {
    return (
        <div className={`relative z-0 h-fit w-fit rounded-full ${margin}`}>
            <img 
                src={src || null} 
                alt={alt} 
                className={`${height} ${width} rounded-full object-center object-cover ${className}`}
                loading="lazy"
            />
            {isOnline && <div className="bg-[#3dff53] border h-[13px] w-[13px] rounded-full absolute right-1 bottom-1"></div>}
        </div>
    )
}