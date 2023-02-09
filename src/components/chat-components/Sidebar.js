import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { FaRocketchat, FaSearch } from 'react-icons/fa'
import { MdSettings, MdSearh } from 'react-icons/md'
import { db } from '../../Firebase'
import ChatUser from './ChatUser'

const chatUsers = [{
    id: 2,
    image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    name: 'Emma Watson',
    lastMessage: 'whats up?',
    lastMessageTime: '22 Minutes ago'
}, {
    id: 2,
    image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    name: 'Emma Watson',
    lastMessage: 'whats up?',
    lastMessageTime: '22 Minutes ago'
}]

function Search({ setSearchResult, setSearchLoading, userSearch, setUserSearch }) {
    const handleSearch = async () => {
        // console.log("Something entered");
        const q = query(collection(db, 'users'), where("displayName", "==", userSearch));
        const querySnapshot = await getDocs(q);
        setSearchLoading(false);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            setSearchResult(doc.data());
        })
    }

    const handleEnter = (e) => {
        e.code === 'Enter' &&
            setSearchLoading(true); 
            handleSearch();
    }

    return (
        <div className='bg-white py-3 px-4 border-b border-gray-100'>
            <input
                type="text"
                className='w-full p-1 focus:outline-none'
                onKeyDown={handleEnter}
                placeholder='Search..'
                onChange={(e) => setUserSearch(e.target.value)}
            />
        </div>
    )
}

export default function Sidebar() {
    const [userSearch, setUserSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState({});
    const [searchLoading, setSearchLoading] = useState(false);
    console.log(searchResult);

    return (
        <div className='col-span-4'>
            <div className='flex justify-between items-center bg-white py-3 px-4 border-b border-gray-100'>
                <div className='flex-1 flex items-center gap-x-4'>
                    <FaRocketchat className='h-8 w-8 text-blue-600' />
                    <h2 className='font-semibold text-lg'>Chats</h2>
                </div>
                <div className='flex justify-between items-center gap-x-5 '>
                    <button
                        type='button'
                        onClick={(e) => setIsSearching(!isSearching)}
                    >
                        <FaSearch className='h-4 w-4 relative top-[0.09rem] text-slate-500' />
                    </button>
                    <MdSettings className='h-5 w-5 text-slate-500' />
                </div>
            </div>
            {isSearching &&
                <Search
                    setSearchResult={setSearchResult}
                    setSearchLoading={setSearchLoading}
                    setUserSearch={setUserSearch}
                    userSearch={userSearch}
                />}
            {userSearch ?
                searchResult?.displayName ? <div className='h-[75%] border border-white'>
                    <button className='w-full'>
                        <ChatUser image={searchResult?.photoURL} name={searchResult?.displayName} />
                    </button>
                </div> : "Search Loading" :
                <div className='h-[75%] overflow-y-auto border border-white'>
                    {chatUsers?.map(({ image, name, lastMessage, lastMessageTime, id }) => (
                        <button className='w-full'>
                            <ChatUser key={id} image={image} name={name} lastMessage={lastMessage} lastMessageTime={lastMessageTime} />
                        </button>
                    ))}
                </div>}
        </div>
    )
}
