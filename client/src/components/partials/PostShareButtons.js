import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { useToggleLike } from "../../hooks/posts";
import Spinner from "../../utils/Spinner";
import { AiOutlineLike, AiTwotoneLike } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';
import { TbArrowAutofitDown } from 'react-icons/tb';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';

const PostShareButtons = ({ postId, isLiked }) => {
  const user = useSelector(selectUser);
  const { toggleLike, isLoading: likeLoading } = useToggleLike({ postId, isLiked, uid: user?.uid })

  if (likeLoading) return (
    <Spinner classList={`w-4 h-4`} />
  )

  return (
    <div className='py-1 border-t border-gray-100 flex justify-between'>
      <button
        className='flex cursor-pointer items-center space-x-2 py-3 px-1 hover:bg-gray-100 rounded-md post-insider-link'
        onClick={toggleLike}
      >
        {isLiked ?
          <AiTwotoneLike className='h-5 w-5 text-blue-600' /> :
          <AiOutlineLike className='h-5 w-5 text-slate-500' />}
        <p className={`${isLiked ? 'text-blue-600' : 'text-neutral-500' } text-sm font-medium`}>Like</p>
      </button>
      <button
        className='flex cursor-pointer items-center space-x-2 py-3 px-1 hover:bg-gray-100 rounded-md post-insider-link'
        
      >
        <FaRegCommentDots className='h-5 w-5 text-slate-500' />
        <p className='text-sm font-medium text-neutral-500'>Comment</p>
      </button>
      <button
        className='flex cursor-pointer items-center space-x-2 py-3 px-1 hover:bg-gray-100 rounded-md post-insider-link'
        
      >
        <TbArrowAutofitDown className='h-5 w-5 text-slate-500' />
        <p className='text-sm font-medium text-neutral-500'>Repost</p>
      </button>
      <button
        className='flex cursor-pointer items-center space-x-2 py-3 px-1 hover:bg-gray-100 rounded-md post-insider-link'
        
      >
        <HiOutlinePaperAirplane className='h-5 w-5 text-slate-500' />
        <p className='text-sm font-medium text-neutral-500'>Send</p>
      </button>
    </div>
  )
}

export default PostShareButtons