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
    const user = useSelector(selectUser);
    // console.log(date);
    // const isLiked = likes?.includes(user?.uid);

    // if (postLoading) return (
    //     <div className='min-h-screen flex items-center justify-center'>
    //         <Spinner classList={'w-8 h-8'} />
    //     </div>
    // )

    return (
        <>
            <Header />
            <section className='max-w-[500px] mx-auto mt-3'>
                <Post postId={id} />
            </section>
        </>
    )
}

export default PostDetails