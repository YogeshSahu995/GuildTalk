export function PopupFormStyle({ isHideState, setIsHideState, children }) {
    return (
        <div className={`${isHideState ? "hidden" : "absolute"} top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[70%] lg:w-1/2 bg-[#282828e8] dark:bg-[#000000d6] bg-blend-difference py-3 px-4 rounded z-[99999999] text-white`}>
            <i
                className="ri-close-large-line absolute top-4 right-4 cursor-pointer"
                onClick={() => setIsHideState(true)}
            ></i>
            {children}
        </div>
    )
}