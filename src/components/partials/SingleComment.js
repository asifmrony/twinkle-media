import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { usePostAuthor } from '../../hooks/posts';

const SingleComment = ({ userId, date, message }) => {
    const { postAuthor, authorLoading } = usePostAuthor(userId);

    return (
        <div className="flex space-x-2">
            <div className='w-11 h-11 bg-white rounded-full'>
                <Link to={`/profile/${postAuthor?.uid}`} className="post-insider-link">
                    <img src={postAuthor?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                </Link>
            </div>
            <div>
                <div className="flex items-center space-x-1">
                    <Link to={`/profile/${userId}`} className="post-insider-link inline-block">
                        <h1 className='font-medium text-sm'>{postAuthor?.displayName}</h1>
                    </Link >
                    {/* <p className='font-light'>{designation}</p> */}
                    <p className='text-xs font-light'>{date && formatDistanceToNow(date)} ago</p>
                </div>
                <p className='text-sm'>{message}</p>
            </div>
        </div>
    )
}

export default SingleComment