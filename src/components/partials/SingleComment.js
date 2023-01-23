import { formatDistanceToNow } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../../features/userSlice';
import { usePostAuthor } from '../../hooks/author';
import { useDeleteComment } from '../../hooks/comment';

const SingleComment = ({ id, userId, date, message }) => {
    const { postAuthor, authorLoading } = usePostAuthor(userId);
    const { deleteComment, deleteLoading }  = useDeleteComment(id);
    const user = useSelector(selectUser);

    return (
        <div className="flex space-x-2 pb-2 border-b border-slate-200">
            <div className='w-11 h-11 bg-white rounded-full'>
                <Link to={`/profile/${postAuthor?.uid}`} className="post-insider-link">
                    <img src={postAuthor?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                </Link>
            </div>
            <div className='flex-1'>
                <div className="flex items-center space-x-1">
                    <Link to={`/profile/${userId}`} className="post-insider-link inline-block">
                        <h1 className='font-medium text-sm'>{postAuthor?.displayName}</h1>
                    </Link >
                    {/* <p className='font-light'>{designation}</p> */}
                    <p className='text-xs font-light'>{date && formatDistanceToNow(date)} ago</p>
                </div>
                <p className='text-sm'>{message}</p>
            </div>
            <div className='p-2 hover:bg-red-100 self-center rounded-full'>
                {user?.uid === userId && <FaTrash 
                    className='h-4 w-4 text-red-600 hover:text-red-900 cursor-pointer'
                    onClick={deleteComment}
                /> }
            </div>
        </div>
    )
}

export default SingleComment