export function CoverImage({
    src = "",
    alt = "",
    className = "",
    height = "h-[150px]",
    width = "w-full"
}) {
    return (
        <img 
            src={src || null} 
            alt={alt} 
            className={`${height} ${width} rounded-2xl object-center object-cover ${className}`}
            loading="lazy"
        />
    )
}