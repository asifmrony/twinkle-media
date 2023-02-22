import { formatDistanceToNow } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'

export default function ChatUser({ id, name, image, lastMessage, lastMessageTime }) {
    return (
        <div className='bg-white py-3 px-4 border-b border-gray-100 w-full flex justify-between hover:bg-blue-600 group'>
            <div className='w-[50px] h-[50px] bg-white rounded-full p-[2px] mr-3'>
                <Link to={`/profile/${id}`} className="post-insider-link">
                    <img src={image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                </Link>
            </div>
            <div className='flex-1 text-left'>
                <h1 className='font-medium group-hover:text-white'>{name}</h1>
                <p className='text-sm text-gray-600 group-hover:text-white'>{lastMessage}</p>
            </div>
            <p className='text-xs text-gray-400 mt-1 group-hover:text-white'>
            {/* {lastMessageTime && formatDistanceToNow(lastMessageTime)} ago */}
            {lastMessageTime}
            </p>
        </div>
    )
}
