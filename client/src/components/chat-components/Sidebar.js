import { formatDistanceToNow } from 'date-fns'
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { FaRocketchat, FaSearch } from 'react-icons/fa'
import { MdSettings, MdSearh } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { ChatContext } from '../../contexts/chatcontext'
import { changeActiveUser, changeChatId, selectUser } from '../../features/userSlice'
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
        // const querySnapshot = await getDocs(q);
        setSearchLoading(false);
        // querySnapshot.forEach((doc) => {
        //     // console.log(doc.id, " => ", doc.data());
        //     setSearchResult(doc.data());
        // })
        onSnapshot(q, (snapshot) => {
            if (snapshot.size) {
                snapshot.docs.map((doc) => {
                    setSearchResult(doc.data())
                })
            }
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
                value={userSearch}
                placeholder='Write full name [Case-Sensitive] & hit Enter'
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
    const currentUser = useSelector(selectUser);
    const [chats, setChats] = useState([]);
    const dispatch = useDispatch();
    const [effect, setEffect] = useState(1);
    // const { dispatch: contextDispatch } = useContext(ChatContext);

    useEffect(() => {
        onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
            console.log(effect);
            setChats(doc.data());
        })

    }, [currentUser.uid, effect])

    /**
     * Send Active Chatuser and combinedId to redux store.
     */
    const handleActiveChat = (userid, displayName, photoURL) => {
        dispatch(changeActiveUser({
            uid: userid,
            displayName: displayName,
            photoURL: photoURL
        }));
        const combinedId = currentUser.uid > userid ? currentUser.uid + userid : userid + currentUser.uid;
        dispatch(changeChatId(combinedId));
    }

    /**
     * Create Chat Settings such as 
        - Create new doc with combinedId in "Chats" collection
        - update recent chat list in sidebar
     */
    const handleSelect = async (userId) => {
        // Whether the group(chat in firestore) exists, if not create new
        const combinedId = currentUser.uid > userId ? currentUser.uid + userId : userId + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));
            if (!res.exists()) {
                // Create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId), {
                    messages: []
                })
                // Update user Chats for currentUser
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: userId,
                        displayName: searchResult?.displayName,
                        photoURL: searchResult?.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                })

                // Update user Chats for Opposite User
                await updateDoc(doc(db, "userChats", userId), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                })

                /* 
                Schema:
                -------
                userChats: {
                    Samuchas Id: {
                        userInfo: {},
                        lastMessage: {},
                        time: creating time
                    }
                } 
                */
            }
        } catch (error) {
            console.log(error);
        }
        setUserSearch('');
        setSearchResult({});
        setIsSearching(!isSearching);
        setEffect(effect + 1);
    }

    return (
        <div className='col-span-4 bg-[#ECF1FF]'>
            <div className='flex justify-between items-center bg-[#d0d6e4] py-3 px-4 border-b border-gray-100'>
                <div className='flex-1 flex items-center gap-x-4'>
                    <FaRocketchat className='h-8 w-8 text-blue-600' />
                    <h2 className='font-semibold text-lg'>Chats</h2>
                </div>
                <div className='flex justify-between items-center gap-x-5 '>
                    <button
                        type='button'
                        onClick={(e) => setIsSearching(!isSearching)}
                    >
                        <FaSearch className='h-5 w-5 relative top-[0.09rem] text-slate-500' title='Search a User' />
                    </button>
                    {/* <MdSettings className='h-5 w-5 text-slate-500' /> */}
                </div>
            </div>
            {isSearching ?
                <>
                    <Search
                        setSearchResult={setSearchResult}
                        setSearchLoading={setSearchLoading}
                        setUserSearch={setUserSearch}
                        userSearch={userSearch}
                    />
                    {searchResult?.displayName &&
                        <div className='h-16 w-80 ml-3 rounded-lg mt-2 bg-white shadow-lg'>
                            <button
                                className='w-full rounded-lg'
                                onClick={() => {
                                    handleSelect(searchResult?.id);
                                    handleActiveChat(searchResult.id, searchResult.displayName, searchResult.photoURL)
                                }}
                            >
                                <ChatUser image={searchResult?.photoURL} name={searchResult?.displayName} />
                            </button>
                        </div>
                    }
                </>
            :
                <div className='h-[465px] overflow-y-auto border border-white'>
                    {chats && Object.entries(chats)?.map((chat) => {
                        const [chatId, { date, userInfo: { displayName, photoURL, uid } }] = chat;
                        console.log(chat)
                        const timeSince = date && formatDistanceToNow(date.toDate());
                        return (
                            // <h1>{chat[0]}</h1>
                            <button key={chatId} className='w-full' onClick={() => handleActiveChat(uid, displayName, photoURL)}>
                                <ChatUser image={photoURL} name={displayName} lastMessageTime={timeSince} lastMessage={chat[1].lastMessage?.input} />
                            </button>
                        )
                    })}
                </div>
            }
        </div>
    )
}
