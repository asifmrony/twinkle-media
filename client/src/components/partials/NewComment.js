import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectUser } from '../../features/userSlice'
import { useAddComment } from '../../hooks/comment'

const NewComment = ({ postId }) => {
    const user = useSelector(selectUser);
    const [commentMessage, setCommentMessage] = useState('')
    const { addComment, commentPosted, commentPostingError: isError } = useAddComment({
        userId: user?.uid,
        postId: postId
    })

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentMessage) {
            alert('Please write your comment');
            return;
        }
        addComment(commentMessage)
        if (commentPosted) {
            setCommentMessage('');
        }
    }

    return (
        <section className='mt-2 px-2'>
            <div className="flex space-x-2">
                <div className='w-8 h-8 bg-white rounded-full'>
                    <Link to={`/profile/${user?.uid}`} className="post-insider-link">
                        <img src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                    </Link>
                </div>
                <div className='w-full'>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            name="comment"
                            id="comment" rows="1"
                            className='w-full rounded-md border-2 focus:outline-none focus:border-slate-400 p-1 text-sm border-slate-200'
                            placeholder='Type your comment'
                            value={commentMessage}
                            onChange={(e) => setCommentMessage(e.target.value)}
                        >
                        </textarea>
                        <div className='text-right'>
                            <button type="submit" className='bg-blue-600 rounded-md px-1 text-sm text-white'>Comment</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default NewComment