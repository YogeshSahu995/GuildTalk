export function EmptyPage({heading, firstMessage, secondMessage}){
    return (
        <div className="flex flex-col items-center justify-center text-center mt-32 px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">{heading}</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                {firstMessage}<br />
                {secondMessage}
            </p>
        </div>
    )
}