import { useEffect, useState } from 'react'
import { db, storage } from '../../Firebase';
import { getDocs, serverTimestamp } from 'firebase/firestore/lite';
import { collection, onSnapshot, query, orderBy, getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Post from './Post';
import CreatePost from './CreatePost';

/**
 * Firestore Lite SDK does not support listeners. 
 * Try importing getFirestore(), onSnapshot and others (if necessary) from the standard SDK.
 * Source: https://stackoverflow.com/questions/74983470/why-firebase-give-this-error-when-i-use-onsnapshot
 * 
*/

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const postsRef = collection(db, 'posts');

  console.log(posts);

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
      // const q = query(postsRef, orderBy('date', 'desc'));
      onSnapshot(postsRef, (snapshot) => {
        if(snapshot.size) {
          setFeedLoading(false);
          setPosts(snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id
            }
          }))
        } else {
          setFeedLoading(false)
        }
      })
    }
    subscribe();
    return () => {
      subscribe()
    }
  }, [])

  const convertToReadableTime = (time) => {
    const timeInMinutes = time / 60;
    const timeInHours = timeInMinutes / 60;
    return `${timeInHours} : ${timeInMinutes}`
  }
  
  return (
    <div className='col-span-5'>
      <div className="feed space-y-2">
        <CreatePost />

        {feedLoading ? 'Loading...' : null}
        {/* Post in Feed */}
        {posts.map(({ userId, id, message, date }) => (
          <Post key={id} userId={userId} postId={id} date={date} message={message} />
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