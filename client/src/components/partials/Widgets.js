import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { BsInfoSquareFill } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import { useAllUsers } from '../../hooks/author';

const Widgets = () => {
    const { allUsers, usersLoading, isError } = useAllUsers();

    const feedPeople = (image, name, bio) => {
        return (
            <div className="px-3 flex items-start space-x-2 py-2">
                <div className='w-12 h-12 bg-white rounded-full p-[2px]'>
                    <img src={image} alt="" className='w-full h-full rounded-full' />
                </div>
                <div className='flex-1'>
                    <h2 className='font-semibold text-sm'>{name}</h2>
                    <p className='text-neutral-500 text-xs mb-2'>{bio}</p>
                    <button type='button' className='flex items-center py-1 px-3 rounded-full space-x-1 border border-neutral-500 text-neutral-500 font-bold hover:bg-neutral-100'>
                        <BiPlus />
                        Follow
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='col-span-3'>
            <div className="sticky top-[4.8rem] widgets card-wrapper py-2 pb-4">
                <div className='flex items-center justify-between px-3 pb-2'>
                    <h1 className='font-bold'>Add to your feed</h1>
                    <BsInfoSquareFill className='text-neutral-500' />
                </div>
                <div className="widgets__peoples">
                    {/* {feedPeople("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon&f=y", "BD Jobs Careers", "Company | Education Management")}
                    {feedPeople("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y", "Fahim Masroor", "CO-Founder, AjkerDeal/Delivery Tiger/Bdjobs.com")}
                    {feedPeople("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y", "Abdullah Al Hasan", "Android | Flutter | Sr. Software Engineer")} */}
                    {allUsers?.map(({ id, displayName, designation, photoURL }) => {
                        if(designation) return (
                            <div className="px-3 flex items-start space-x-2 py-2">
                                <div className='w-12 h-12 bg-white rounded-full p-[2px]'>
                                    <img src={photoURL} alt="" className='w-full h-full rounded-full' />
                                </div>
                                <div className='flex-1'>
                                    <h2 className='font-semibold text-sm'>{displayName}</h2>
                                    <p className='text-neutral-500 text-xs mb-2'>{designation}</p>
                                    <Link to={`/profile/${id}`} className='flex items-center py-1 px-3 w-24 justify-center rounded-full space-x-1 border border-neutral-500 text-neutral-500 font-bold hover:bg-neutral-100'>
                                        <BiPlus />
                                        Follow
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Widgets