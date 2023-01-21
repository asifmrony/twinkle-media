import { formatDistanceToNow } from "date-fns";
import { useComments } from "../../hooks/comment"
import { usePostAuthor } from "../../hooks/posts";
import Spinner from "../../utils/Spinner";
import SingleComment from "./SingleComment";

const CommentList = ({ postId }) => {
    const { allComments, commentLoading, commentFetchError } = useComments(postId)

    if(commentLoading) return (
        <div className="flex justify-center items-center">
            <Spinner classList={'w-6 h-6'} />
        </div>
    )
    if(commentFetchError) return "Error Loading Comments"

    return (
        <div className='space-y-4 px-2'>
            {
                allComments.map(({ id, userId, date, message }) => (
                    <SingleComment key={id} userId={userId} date={date} message={message} />
                ))
            }
        </div>
    )
}

export default CommentList