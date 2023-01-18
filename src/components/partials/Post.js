import { Fragment, useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { Menu, Transition, Dialog } from '@headlessui/react';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineLike, AiTwotoneLike } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';
import { TbArrowAutofitDown } from 'react-icons/tb';
import { IoIosWarning } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { HiOutlinePaperAirplane } from 'react-icons/hi2'
import PostShareButton from "./PostShareButton";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

const Post = ({ likes, userId, postId, date, message }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [postToUpdate, setPostToUpdate] = useState({});
    const [postToDelete, setPostToDelete] = useState(null);
    const [updatedMessage, setUpdatedMessage] = useState('');
    const [postAuthor, setPostAuthor] = useState('');
    const user = useSelector(selectUser);

    const likesCount = likes?.length;
    const isLiked = likes?.includes(user?.uid);
    
    
    useEffect(() => {
        const getPostAuthor = async () => {
            const docSnap = await getDoc(doc(db, "users", userId))
            if(docSnap.exists()) {
                setPostAuthor(docSnap.data());
            } else {
                console.log('No Such Documents');
            }
        }
        getPostAuthor()
      
    }, [userId])
    

    const openModal = async (id) => {
        setIsEditOpen(true);
        const docRef = doc(db, "posts", id)
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setPostToUpdate({ ...docSnap.data(), id: id });
            setUpdatedMessage(docSnap.data().message);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    //Update Posts
    const updatePost = (id) => {
        const postDoc = doc(db, 'posts', id);
        // Edited message as update post data
        const newMessage = { message: updatedMessage }
        updateDoc(postDoc, newMessage)
            .then(() => {
                toast('Post Updated');
                setTimeout(() => setIsEditOpen(false), 2000);
            })
            .catch((err) => toast.error(err.message));
    }


    //Delete Posts [Modification requires]
    const deletePost = async (id) => {
        const postdoc = doc(db, 'posts', id);
        await deleteDoc(postdoc)
            .then(() => {
                toast.error('Post has been Deleted');
                setIsDeleteOpen(false);
            })
            .catch((err) => {
                console.log(err);
                toast('Error Deleting Post');
            })
    }

    return (
        <div className="card-wrapper px-3">
            <ToastContainer />
            <div className="flex space-x-2 pt-3">
                <div className='w-14 h-14 bg-white rounded-full p-[2px]'>
                    <Link to={`/profile/${userId}`} >
                        <img src={postAuthor?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                    </Link>
                </div>
                <div className='text-sm flex-1 text-neutral-700'>
                    <Link to={`/profile/${userId}`} >
                        <h1 className='font-medium'>{postAuthor?.displayName}</h1>                    
                    </Link >
                    {/* <p className='font-light'>{designation}</p> */}
                    <p className='text-xs font-light'>{formatDistanceToNow(date)} ago</p>
                </div>

                {user?.uid === userId && <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className=''>
                            <BsThreeDots className='text-neutral-500 h-6 w-6' />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-0 w-[8rem] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                            <div className="px-1 pt-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => openModal(postId)}
                                            type='button'
                                            className={`${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="px-1 pb-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            type='button'
                                            onClick={() => {
                                                setIsDeleteOpen(true);
                                                setPostToDelete(postId);
                                            }}
                                            className={`${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>}
            </div>
            <div className='py-3 text-sm text-neutral-700'>
                {message}
            </div>
            <div className='py-1 border-t border-gray-100 flex justify-between'>
                <PostShareButton 
                    icon={isLiked ? 
                        <AiTwotoneLike className='h-5 w-5 text-blue-600' /> : 
                        <AiOutlineLike className='h-5 w-5 text-slate-500' />} 
                    label={likesCount} 
                    postId = {postId}
                    isLiked = {isLiked}
                />
                <PostShareButton icon={<FaRegCommentDots className='h-5 w-5 text-slate-500' />} label={'Comment'} />
                <PostShareButton icon={<TbArrowAutofitDown className='h-5 w-5 text-slate-500' />} label={'Repost'} />
                <PostShareButton icon={<HiOutlinePaperAirplane className='h-5 w-5 text-slate-500' />} label={'Send'} />
            </div>
            <Transition appear show={isEditOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsEditOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Update your post
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <textarea name="" id=""
                                            rows="7"
                                            value={updatedMessage}
                                            onChange={(e) => setUpdatedMessage(e.target.value)}
                                            className='text-sm text-gray-500 w-full p-2 border border-gray-200 rounded-md focus:outline-none'>
                                        </textarea>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => updatePost(postToUpdate?.id)}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={isDeleteOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-red-600 flex items-center space-x-2"
                                    >
                                        <IoIosWarning /> <span>Delete</span>
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Do you really want to Delete the post?
                                        </p>
                                    </div>

                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 focus:outline-none"
                                            onClick={() => {
                                                setIsDeleteOpen(false);
                                                setPostToDelete(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() => deletePost(postToDelete)}
                                        >
                                            Yes, Delete it!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Post