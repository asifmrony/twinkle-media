import React, { Fragment, useEffect, useState } from 'react'
import { BsCalendarDate, BsReverseLayoutTextSidebarReverse, BsThreeDots } from 'react-icons/bs'
import { HiPhoto, HiVideoCamera, HiOutlinePaperAirplane } from 'react-icons/hi2'
import { AiOutlineLike } from 'react-icons/ai';
import { FaRegCommentDots, FaUserCircle } from 'react-icons/fa';
import { TbArrowAutofitDown } from 'react-icons/tb';
import { IoIosWarning } from 'react-icons/io'
import { db, storage } from '../../Firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { toast, ToastContainer } from 'react-toastify';
import { getDocs, serverTimestamp } from 'firebase/firestore/lite';
import { collection, onSnapshot, addDoc, query, orderBy, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

/**
 * Firestore Lite SDK does not support listeners. 
 * Try importing getFirestore(), onSnapshot and others (if necessary) from the standard SDK.
 * Source: https://stackoverflow.com/questions/74983470/why-firebase-give-this-error-when-i-use-onsnapshot
 * 
*/

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [postInput, setPostInput] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState({});
  const [postToDelete, setPostToDelete] = useState(null);
  const [updatedMessage, setUpdatedMessage] = useState('');
  const [file, setFile] = useState();
  const postsRef = collection(db, 'posts');
  const user = useSelector(selectUser);

  console.log(postInput);
  console.log(posts);

  // Send Post Data to firebase database
  const sendPost = async (e) => {
    e.preventDefault();
    // await addDoc(postsRef, {
    //   name: user?.displayName,
    //   designation: user?.email,
    //   message: postInput,
    //   photUrl: user?.photoURL || '',
    //   // timestamp: serverTimestamp(),
    // }).then(() => {
    //   toast("Your post has been created.");
    //   setPostInput('');
    // }).catch((err) => {
    //   console.log(err);
    //   toast(err.message);
    // })
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  useEffect(() => {
    // const getPosts = async () => {
    //   const q = query(postsRef, orderBy('timestamp', 'desc'));
    //   const querySnapshot = await getDocs(q);
    //   setPosts(querySnapshot.docs.map((doc) => {
    //     console.log(doc.data());
    //     return {...doc.data(), id: doc.id};
    //   }));
    // }

    // getPosts();

    const subscribe = () => {
      /**
       * TO-DO: posts sorting order
       * query(), orderBy() dont work with realtime onSnapshot listener
       * Find a workaround for this one below ->
       * const q = query(postsRef, orderBy('timestamp', 'desc'));
       */
      onSnapshot(postsRef, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id
          }
        }))
      })
    }
    subscribe();
    return () => {
      subscribe()
    }
  }, [])

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
  console.log(postToUpdate, updatedMessage);

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

  const convertToReadableTime = (time) => {
    const timeInMinutes = time / 60;
    const timeInHours = timeInMinutes / 60;
    return `${timeInHours} : ${timeInMinutes}`
  }

  //Post Share Button UI Jsx Render
  const postShareButton = (icon, label) => {
    return (
      <div className='flex cursor-pointer items-center space-x-2 py-3 px-1 hover:bg-gray-100 rounded-md'>
        {icon}
        <p className='text-sm font-medium text-neutral-500'>{label}</p>
      </div>
    )
  }

  return (
    <div className='col-span-5'>
      <div className="feed space-y-2">
        <ToastContainer />
        {/* Post Sharing Card */}
        <div className="card-wrapper px-3 pt-3">
          <div className="flex items-center space-x-3">
            <div className='w-14 h-14 bg-white rounded-full p-[2px]'>
              <img src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
            </div>
            <form className='flex-1'>
              <input
                type="text"
                value={postInput}
                onChange={(e) => setPostInput(e.target.value)}
                className='w-full py-3 px-5 rounded-full placeholder:text-neutral-500 
              placeholder:font-semibold border outline-1 outline-transparent border-neutral-500 placeholder:text-sm
               focus:border-blue-500 focus:border-2'
                placeholder='Start a post' />
              <input
                type="file"
                name="photoShare"
                onChange={(e) => setFile(e.target.files[0])}
                id="photoShare" />
              <button
                type="submit"
                className='border border-nutral-500 p-3 hidden'
                onClick={sendPost}>Send</button>
            </form>
          </div>
          <div className="flex justify-between items-center py-1">
            {postShareButton(<HiPhoto className='h-5 text-blue-500' />, 'Photo')}
            {postShareButton(<HiVideoCamera className='h-5 text-green-500' />, 'Video')}
            {postShareButton(<BsCalendarDate className='h-5 text-orange-500' />, 'Audio Event')}
            {postShareButton(<BsReverseLayoutTextSidebarReverse className='h-5 text-red-700' />, 'Write Article')}
          </div>
        </div>

        {/* Post in Feed */}
        {posts.map(({ id, name, designation, message, photUrl }) => (
          <div className="card-wrapper px-3" key={id}>
            <div className="flex space-x-2 pt-3">
              <div className='w-14 h-14 bg-white rounded-full p-[2px]'>
                <img src={photUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
              </div>
              <div className='text-sm flex-1 text-neutral-700'>
                <h1 className='font-medium'>{name}</h1>
                <p className='font-light'>{designation}</p>
                <p className='text-xs font-light'>24m ago</p>
              </div>

              <Menu as="div" className="relative inline-block text-left">
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
                            onClick={() => openModal(id)}
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
                              setPostToDelete(id);
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
              </Menu>
            </div>
            <div className='py-3 text-sm text-neutral-700'>
              {message}
            </div>
            <div className='py-1 border-t border-gray-100 flex justify-between'>
              {postShareButton(<AiOutlineLike className='h-5 w-5 text-slate-500' />, 'Like')}
              {postShareButton(<FaRegCommentDots className='h-5 w-5 text-slate-500' />, 'Comment')}
              {postShareButton(<TbArrowAutofitDown className='h-5 w-5 text-slate-500' />, 'Repost')}
              {postShareButton(<HiOutlinePaperAirplane className='h-5 w-5 text-slate-500' />, 'Send')}
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
        ))}
        {/* <div className="card-wrapper px-3">
          <div className="flex space-x-2 pt-3">
            <div className='w-14 h-14 bg-white rounded-full p-[2px]'>
              <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="" className='w-full h-full rounded-full' />
            </div>
            <div className='text-sm flex-1 text-neutral-700'>
              <h1 className='font-medium'>Jennifer Nelson</h1>
              <p className='font-light'>Recruiter/Talent Acquisition</p>
              <p className='text-xs font-light'>24m ago</p>
            </div>
            <BsThreeDots className='text-neutral-500 h-6 w-6' />
          </div>
          <div className='py-3 text-sm text-neutral-700'>
            Any of my network-who are Merchandise Managers-(based in the US currently) want to go work in Barbados for a while? Work for a Global, vertical apparel company in the sun! Reach out to me!
          </div>
          <div className='py-1 border-t border-gray-100 flex justify-between'>
            {postShareButton(<AiOutlineLike className='h-5 w-5 text-slate-500' />, 'Like')}
            {postShareButton(<FaRegCommentDots className='h-5 w-5 text-slate-500' />, 'Comment')}
            {postShareButton(<TbArrowAutofitDown className='h-5 w-5 text-slate-500' />, 'Repost')}
            {postShareButton(<HiOutlinePaperAirplane className='h-5 w-5 text-slate-500' />, 'Send')}
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Feed