import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { useToggleLike } from "../../hooks/posts";
import Spinner from "../../utils/Spinner";

const PostShareButton = ({ icon, label, postId, isLiked }) => {
  const user = useSelector(selectUser);
  const { toggleLike, isLoading: likeLoading } = useToggleLike({ postId, isLiked, uid: user?.uid })

  if (likeLoading) return (
    <Spinner classList={`w-4 h-4`} />
  )

  return (
    <button
      className='flex cursor-pointer items-center space-x-2 py-3 px-1 hover:bg-gray-100 rounded-md'
      onClick={toggleLike}
    >
      {icon}
      <p className='text-sm font-medium text-neutral-500'>{label}</p>
    </button>
  )
}

export default PostShareButton