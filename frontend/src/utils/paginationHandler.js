
export function paginationHandler({scrollContainer, setPage, hasNextPage}){
    
    const handleScroll = () => {
        if(!scrollContainer || !hasNextPage) return 
        if(scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 1 && hasNextPage){
            setPage(prev => ++prev)
        }
    }

    if(scrollContainer){
        scrollContainer.addEventListener("scroll", handleScroll)
    }

    return handleScroll
}