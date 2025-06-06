export function BigLoader ({
    height="h-[80px] md:h-[100px]",
    width="w-[80px] md:w-[100px]",
}) {
    return (
        <span className={`bigLoader ${height} ${width} after:bg-[#aa63fc] dark:after:bg-[#ff8201]`}></span>
    )
}