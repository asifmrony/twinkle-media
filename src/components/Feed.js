import React, { useEffect, useState } from 'react'
import { BsCalendarDate, BsReverseLayoutTextSidebarReverse, BsThreeDots } from 'react-icons/bs'
import { HiPhoto, HiVideoCamera, HiOutlinePaperAirplane } from 'react-icons/hi2'
import { AiOutlineLike } from 'react-icons/ai';
import { FaRegCommentDots, FaUserCircle } from 'react-icons/fa';
import { TbArrowAutofitDown } from 'react-icons/tb';
import { db } from './Firebase';
import { addDoc, collection, deleteDoc, getDocs, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore/lite';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [postInput, setPostInput] = useState('');
  // const collectionRef = collection(db, 'cities');
  const postsRef = collection(db, 'posts');

  useEffect(() => {
    const getPosts = async () => {
      // setPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      const q = query(postsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs.map((doc) => ({data: doc.data(), id: doc.id})));
    }

    getPosts();
  }, [])

  console.log(postInput);
  console.log(posts);

  // Send Post Data to firebase database
  const sendPost = async (e) => {
    e.preventDefault();
    await addDoc(postsRef, {
      name: 'Asif Mahmud Rony',
      designation: 'React Enthusiast',
      message: postInput,
      photUrl: '',
      timestamp: serverTimestamp(),
    })
    console.log('Happeing Realtime');
    setPostInput('');
  }

  //Update Posts [Modification requires]
  const updatePost = async (id, updateMessage) => {
    const postDoc = doc(db, 'posts', id);
    // Edited message as update post data
    const newMessage = { message: updateMessage }
    await updateDoc(postDoc, newMessage);
  }


  //Delete Posts [Modification requires]
  const deleteUser = async (id) => {
    const postdoc = doc(db, 'posts', id);
    await deleteDoc(postdoc);
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
        {/* Test Cities */}
        {/* {test.map(dt => (
          <div>
            <h1>{dt.tk}</h1>
            <h3>{dt.tn}</h3>
            <h6>{dt.id}</h6>
          </div>
        ))} */}
        {/* Post Sharing Card */}
        <div className="card-wrapper px-3 pt-3">
          <div className="flex items-center space-x-3">
            <div className='w-14 h-14 bg-white rounded-full p-[2px]'>
              <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="" className='w-full h-full rounded-full' />
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
        {posts.map(({ id, data: { name, designation, message, photoUrl }}) => (
          <div className="card-wrapper px-3" key={id}>
            <div className="flex space-x-2 pt-3">
              <div className='w-14 h-14 bg-white rounded-full p-[2px]'>
                <img src={photoUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
              </div>
              <div className='text-sm flex-1 text-neutral-700'>
                <h1 className='font-medium'>{name}</h1>
                <p className='font-light'>{designation}</p>
                <p className='text-xs font-light'>24m ago</p>
              </div>
              <BsThreeDots className='text-neutral-500 h-6 w-6' />
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