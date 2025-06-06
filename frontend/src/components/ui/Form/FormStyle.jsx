export function FormStyle({
    children,
    heading,
}) {
    return (
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%] sm:w-[70%] md:w-1/2 lg:w-1/3 mx-auto bg-[#f1e8ff] dark:bg-[#3a6d8c58] p-4 border border-transparent rounded-2xl text-center shadow-lg">
            {heading &&
                <h1
                    className="text-[#aa63fc] dark:text-[#ff8201] text-2xl font-semibold md:text-3xl lg:text-4xl mb-8 px-2 underline underline-offset-4 "
                >{heading}</h1>
            }
            {children}
        </div>
    )
}