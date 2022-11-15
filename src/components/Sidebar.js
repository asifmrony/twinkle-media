import React from 'react';
import { BsBookmarkFill, BsPeopleFill, BsHash } from 'react-icons/bs';

const Sidebar = () => {
  const hashtags = (icon, title) => {
    return (
      <div className="flex text-sm items-center space-x-3 py-1 px-3 cursor-pointer text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900">
        {icon}
        <p className='font-semibold'>{title}</p>
      </div>
    )
  }

  return (
    <div className='col-span-3 space-y-2'>
      <div className="profile-meta card-wrapper">
        <img src="https://picsum.photos/400/100" alt="Cover Photo" className='w-full object-contain rounded-tl-lg rounded-tr-lg' />
        <div className='w-16 h-16 bg-blue-500 rounded-full p-[2px] mx-auto -mt-4'>
          <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="" className='w-full h-full rounded-full' />
        </div>
        <div className='py-3 px-3 border-b border-gray-100'>
          <h1 className='font-bold text-center text-lg'>Asif Mahmud Rony</h1>
          <h4 className='text-neutral-500 text-sm text-center'>Jr. Frontend Engineer at CodeSmith Tech Ltd.</h4>
        </div>
        <div className="py-2 text-neutral-500 font-bold text-sm border-b border-gray-100">
          <div className="flex justify-between px-3 py-1 cursor-pointer hover:bg-neutral-50">
            <p>Who's viewed your profile</p>
            <p className='text-blue-500'>5</p>
          </div>
          <div className="flex justify-between px-3 py-1 cursor-pointer hover:bg-neutral-50">
            <p>Impressions of your post</p>
            <p className='text-blue-500'>149</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 py-3 px-3 text-sm cursor-pointer hover:bg-neutral-50 rounded-bl-lg rounded-br-lg">
          <BsBookmarkFill className='text-neutral-500' />
          <p className='font-semibold'>My Items</p>
        </div>
      </div>
      <div className="recent-hashtags card-wrapper">
        <h1 className='py-2 px-3'>Recent</h1>
        <div className='pb-1 border-b border-gray-100'>
          {hashtags(<BsPeopleFill />, 'Front End Developer Group')}
          {hashtags(<BsPeopleFill />, 'Data Analytics | Data Scientists')}
          {hashtags(<BsPeopleFill />, 'All things Javascript: Node.js')}
          {hashtags(<BsPeopleFill />, 'Upwork Professional Group')}
          {hashtags(<BsHash />, 'Userexperience')}
        </div>
        <div className="pt-2 pb-3 px-3 cursor-pointer hover:bg-neutral-50 rounded-bl-lg rounded-br-lg text-center font-semibold text-neutral-500">
          Discover more
        </div>
      </div>
    </div>
  )
}

export default Sidebar