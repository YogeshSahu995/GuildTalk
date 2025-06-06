import { useParams } from "react-router-dom"
import { Post as PostComp } from "../components/components/index"

export function Post(){
    const {postId} = useParams()
    
    return <PostComp postId={postId}/>
}