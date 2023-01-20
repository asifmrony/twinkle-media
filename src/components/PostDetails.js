import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { selectUser } from '../features/userSlice';
import { usePost } from '../hooks/posts';
import Spinner from '../utils/Spinner';
import Header from './partials/Header'
import Post from './partials/Post';
import PostShareButtons from './partials/PostShareButtons';

const PostDetails = () => {
    const { id } = useParams();
    const { post, isLoading } = usePost(id);
    const {userId, id: postId, date, message, likes} = post;
    const user = useSelector(selectUser);
    console.log(post);
    // console.log(date);
    const isLiked = likes?.includes(user?.uid);

    if (isLoading) return (
        <div className='min-h-screen flex items-center justify-center'>
            <Spinner classList={'w-8 h-8'} />
        </div>
    )

    return (
        <>
            <Header />
            <section className='max-w-[500px] mx-auto mt-3'>
                <Post userId={userId} postId={postId} date={date} message={message} likes={likes} />
                {/* <PostShareButtons label={'Like'} postId={postId} isLiked={isLiked} /> */}
            </section>
        </>
    )
}

export default PostDetails