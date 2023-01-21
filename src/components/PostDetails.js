import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
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
    const user = useSelector(selectUser);

    return (
        <>
            <Header />
            <section className='max-w-[500px] mx-auto mt-3'>
                <Post postId={id} />
                <NewComment postId={id} />
                <CommentList postId={id} />
            </section>
        </>
    )
}

export default PostDetails