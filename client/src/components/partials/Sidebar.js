import React from 'react';
import { BsBookmarkFill, BsPeopleFill, BsHash } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../../features/userSlice';
import { usePostAuthor } from '../../hooks/author';

const Sidebar = () => {
  const user = useSelector(selectUser);
  const { postAuthor, authorLoading, errorObj } = usePostAuthor(user.uid);

  // Man headshot avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"

  return (
    <div className='col-span-3'>
      {/* <div className='space-y-2'> */}
      <div className="profile-meta sticky top-[4.8rem] card-wrapper">
        <img src="https://picsum.photos/400/100" alt="Cover Photo" className='w-full object-contain rounded-tl-lg rounded-tr-lg' />
        <div className='w-16 h-16 bg-blue-500 rounded-full p-[2px] mx-auto -mt-4 relative z-10'>
          <img src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
        </div>
        <div className='pt-2 pb-3 px-3 border-b border-gray-100'>
          <h1 className='font-bold text-center'>{user?.displayName}</h1>
          <h4 className='text-neutral-500 text-sm text-center'>{postAuthor?.designation}</h4>
        </div>
        <div className="py-2 text-neutral-500 font-semibold text-sm border-b border-gray-100">
          <div className="flex justify-between px-3 py-1 cursor-pointer hover:bg-neutral-50 text-xs">
            <p>Who's viewed your profile</p>
            <p className='text-blue-500'>0</p>
          </div>
          {/* <div className="flex justify-between px-3 py-1 cursor-pointer hover:bg-neutral-50 text-xs">
              <p>Impressions of your post</p>
              <p className='text-blue-500'>149</p>
            </div> */}
        </div>
        <Link to={`/profile/${user?.uid}`}>
          <div className="flex items-center space-x-2 py-3 px-3 text-sm cursor-pointer hover:bg-neutral-50 rounded-bl-lg rounded-br-lg">
            <BsBookmarkFill className='text-neutral-500' />
            <p className='font-semibold'>My Items</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar