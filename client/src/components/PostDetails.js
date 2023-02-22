import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { SocketContextProvider } from '../contexts/socketContext';
import { selectUser } from '../features/userSlice';
import { usePost } from '../hooks/posts';
import Spinner from '../utils/Spinner';
import CommentList from './partials/CommentList';
import Header from './partials/Header'
import NewComment from './partials/NewComment';
import Post from './partials/Post';
import PostShareButtons from './partials/PostShareButtons';

const PostDetails = () => {
    const { id } = useParams();
    const { notFound } = usePost(id);

    if (notFound) return (
        <div className='min-h-[500px] flex justify-center items-center'>
            <div className='space-y-1'>
                <p>Post not found..</p>
                <p>Get back to
                    <Link to={'/'} className='bg-blue-600 text-white ml-1 p-1 rounded-md'>Feed</Link>
                </p>
            </div>
        </div>
    )

    return (
        <SocketContextProvider>
            <Header />
            <section className='max-w-[500px] mx-auto mt-3'>
                <Post postId={id} />
                <NewComment postId={id} />
                <CommentList postId={id} />
            </section>
        </SocketContextProvider>
    )
}

export default PostDetails