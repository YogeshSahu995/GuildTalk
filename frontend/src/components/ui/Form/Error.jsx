export function Error({className, message}) {
    return (
        <div className={`${className} italic underline mt-2 text-sm text-[#ff5757] px-2 rounded-lg `}>
            <i className="ri-error-warning-fill mr-2"></i>
            {message}
        </div>
    )
}