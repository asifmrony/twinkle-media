import { Fragment, useContext, useEffect, useState } from "react";
import { Menu, Transition, Dialog } from '@headlessui/react';
import { toast, ToastContainer } from 'react-toastify';
import { IoIosWarning } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import PostShareButtons from "./PostShareButtons";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSocket, selectUser } from "../../features/userSlice";
import { useDeletePost, useUpdatePost, usePost } from "../../hooks/posts";
import Spinner from "../../utils/Spinner";
import { useComments } from '../../hooks/comment'
import { usePostAuthor } from "../../hooks/author";
import { SocketContext } from "../../contexts/socketContext";

const Post = ({ postId }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [updatedMessage, setUpdatedMessage] = useState('');
    const { updatePost, postUpdated, isError: updateError } = useUpdatePost();
    const { deletePost, postDeleted, isError: deleteError } = useDeletePost();
    const { post: postDoc, isLoading: postLoading } = usePost(postId);
    const { likes, userId, message, date } = postDoc;
    const user = useSelector(selectUser);
    const { postAuthor, authorLoading } = usePostAuthor(userId);
    const { allComments, commentLoading, commentFetchError } = useComments(postId)

    const likesCount = likes?.length;
    const isLiked = likes?.includes(user?.uid);
    const params = useParams();
    const navigate = useNavigate();

    const openModal = async (id) => {
        setIsEditOpen(true);
        if (postDoc) {
            setUpdatedMessage(postDoc?.message);
        } else {
            console.log("Could't get any post");
        }
    }

    //Update Posts
    const handleUpdatePost = (id) => {
        updatePost(id, updatedMessage);
        if (postUpdated) {
            toast.success('Post Updated');
            setTimeout(() => setIsEditOpen(false), 2000);
        }
        if (updateError) {
            toast.error(updateError)
        }
    }


    //Delete Posts [Modification requires]
    const handleDeletePost = (id) => {
        deletePost(id);
        if (postDeleted) {
            toast.success('Post Deleted');
            setTimeout(() => setIsDeleteOpen(false), 2000);
        }
        if (deleteError) {
            toast.error(deleteError)
        }
    }

    if (postLoading) return (
        <div className='min-h-screen flex items-center justify-center'>
            <Spinner classList={'w-8 h-8'} />
        </div>
    )

    return (
        <div className="card-wrapper post-container px-3">
            <ToastContainer />
            <div className="flex space-x-2 pt-3">
                <div className='w-14 h-14 bg-white rounded-full p-[2px]'>
                    <Link to={`/profile/${userId}`} className="post-insider-link">
                        <img src={postAuthor?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                    </Link>
                </div>
                <div className='text-sm flex-1 text-neutral-700'>
                    <Link to={`/profile/${userId}`} className="post-insider-link inline-block">
                        <h1 className='font-medium'>{postAuthor?.displayName}</h1>
                    </Link >
                    {/* <p className='font-light'>{designation}</p> */}
                    <p className='text-xs font-light'>{date && formatDistanceToNow(date)} ago</p>
                </div>

                {user?.uid === userId && <Menu as="div" className="relative inline-block text-left post-insider-link">
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
                                            onClick={() => navigate(`/post/${postId}`)}
                                            type='button'
                                            className={`${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                                        >
                                            Go to post page
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
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
            <div className='py-3 px-1 text-sm text-neutral-700'>
                {message}
            </div>
            <div className="flex justify-between py-3 px-1">
                <p className="text-xs text-slate-500">{likesCount > 1 ? likesCount + " likes" : likesCount == 1 ? likesCount + " like" : null}</p>
                <p className="text-xs text-slate-500">{allComments?.length > 1 ? allComments?.length + " comments" : allComments?.length == 1 ? allComments?.length + " comment" : null}</p>
            </div>
            <PostShareButtons
                postId={postId}
                isLiked={isLiked}
            />
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
                                            onClick={() => handleUpdatePost(postDoc?.id)}
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
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() => handleDeletePost(postId)}
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
            {params.id === undefined && <Link to={`/post/${postId}`} className='post-wrap-link' />}
        </div>
    )
}

export default Post