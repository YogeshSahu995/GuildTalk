export function ReceivedMessage({message, time, senderUsername, id}){
    return (
        <div className="flex flex-wrap items-end gap-1 w-fit wrap-break-word whitespace-normal overflow-visible max-w-[50%] h-fit p-2 mb-2 text-sm sm:text-base rounded-xl bg-[#000000aa] text-amber-50">
            <div className=" w-full flex flex-col">
                {senderUsername && <i className="text-xs ml-auto text-[#ffffff94] gap-1">~{senderUsername}</i>}
                {message}
            </div>
            <p className="text-[#ffffff94] text-xs ml-auto italic">{time}</p>
        </div>
    )
}