export function Loader(
    {
        height = "h-[30px]",
        widht = "w-[30px]",
        className = ""
    }
) {
    return (
        <span 
            className={`border-t-[#aa63fc] dark:border-t-[#ff8201] mx-1 ${height} ${widht} ${className} loader`}>

        </span>
    )
}