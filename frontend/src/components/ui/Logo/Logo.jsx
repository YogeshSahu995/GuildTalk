export function Logo({
    height = "h-auto",
    width = "w-[100px]"
}){
    return <div className="h-fit p-2">
        <img
            src="/Logo.png"
            className={`${height} ${width} object-cover object-center`}
        />
    </div>
}