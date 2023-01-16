import { useEffect, useState } from 'react'
import { BsCalendarDate, BsReverseLayoutTextSidebarReverse } from 'react-icons/bs'
import { HiPhoto, HiVideoCamera } from 'react-icons/hi2'
import { db, storage } from '../../Firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import { getDocs, serverTimestamp } from 'firebase/firestore/lite';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Post from './Post';

/**
 * Firestore Lite SDK does not support listeners. 
 * Try importing getFirestore(), onSnapshot and others (if necessary) from the standard SDK.
 * Source: https://stackoverflow.com/questions/74983470/why-firebase-give-this-error-when-i-use-onsnapshot
 * 
*/

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [postInput, setPostInput] = useState('');
  const [file, setFile] = useState();
  const [feedLoading, setFeedLoading] = useState(true);
  const postsRef = collection(db, 'posts');
  const user = useSelector(selectUser);

  console.log(postInput);
  console.log(posts);

  // Send Post Data to firebase database
  const sendPost = async (e) => {
    e.preventDefault();
    await addDoc(postsRef, {
      name: user?.displayName,
      designation: user?.email,
      message: postInput,
      photUrl: user?.photoURL || '',
      // timestamp: serverTimestamp(),
    }).then(() => {
      toast("Your post has been created.");
      setPostInput('');
    }).catch((err) => {
      console.log(err);
      toast(err.message);
    })

    /**
     * Image Uploading codes
     */
    // const storageRef = ref(storage, file.name);
    // const uploadTask = uploadBytesResumable(storageRef, file);
    // uploadTask.on('state_changed',
    //   (snapshot) => {
    //     // Observe state change events such as progress, pause, and resume
    //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log('Upload is ' + progress + '% done');
    //     switch (snapshot.state) {
    //       case 'paused':
    //         console.log('Upload is paused');
    //         break;
    //       case 'running':
    //         console.log('Upload is running');
    //         break;
    //     }
    //   },
    //   (error) => {
    //     // Handle unsuccessful uploads
    //   },
    //   () => {
    //     // Handle successful uploads on complete
    //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       console.log('File available at', downloadURL);
    //     });
    //   }
    // );
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

        {feedLoading ? 'Loading...' : null}
        {/* Post in Feed */}
        {posts.map(({ id, name, designation, message, photUrl }) => (
          <Post id={id} name={name} designation={designation} message={message} photUrl={photUrl}/>
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