import { useSelector } from "react-redux";
import { selectSocket, selectUser } from "../../features/userSlice";
import { usePost, useToggleLike } from "../../hooks/posts";
import Spinner from "../../utils/Spinner";
import { AiOutlineLike, AiTwotoneLike } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';
import { TbArrowAutofitDown } from 'react-icons/tb';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';
import { usePostAuthor } from "../../hooks/author";

const PostShareButtons = ({ postId, isLiked }) => {
  const user = useSelector(selectUser);
  const { toggleLike, isLoading: likeLoading } = useToggleLike({ postId, isLiked, uid: user?.uid })
  const { post: postDoc, isLoading: postLoading } = usePost(postId);
  const { likes, userId, message, date } = postDoc;
  const { postAuthor, authorLoading } = usePostAuthor(userId);
  const socket = useSelector(selectSocket);

  if (likeLoading) return (
    <Spinner classList={`w-4 h-4`} />
  )

  const likeHandler = async () => {
    await toggleLike();
    socket?.emit("sendNotification", {
      senderName: user.displayName,
      senderPhoto: user.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      receiverName: postAuthor?.displayName,
      // 0 means dislike, 1 means like
      type: isLiked ? 0 : 1,
      postLink: postId
    })
  }

  return (
    <div className='py-1 border-t border-gray-100 flex justify-between'>
      <button
        className='flex cursor-pointer items-center space-x-2 py-3 px-1 hover:bg-gray-100 rounded-md post-insider-link'
        onClick={likeHandler}
      >
        {isLiked ?
          <AiTwotoneLike className='h-5 w-5 text-blue-600' /> :
          <AiOutlineLike className='h-5 w-5 text-slate-500' />}
        <p className={`${isLiked ? 'text-blue-600' : 'text-neutral-500'} text-sm font-medium`}>Like</p>
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