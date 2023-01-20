import { useState } from "react";
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { BsCalendarDate, BsReverseLayoutTextSidebarReverse } from 'react-icons/bs'
import { HiPhoto, HiVideoCamera } from 'react-icons/hi2'
import { useAddPost } from "../../hooks/posts";
import { toast, ToastContainer } from 'react-toastify'
import PostShareButtons from "./PostShareButtons";

const CreatePost = () => {
    const [postInput, setPostInput] = useState('');
    const [file, setFile] = useState();
    const user = useSelector(selectUser);
    const { addPost, isLoading, postCreated, isError } = useAddPost()

    // Send Post Data to firebase database
    const sendPost = (e) => {
        e.preventDefault();
        addPost({
            message: postInput,
            userId: user?.uid
        })
        if(postCreated) {
            setPostInput('');
            toast("Your post has been created.");
        } else {
            toast(isError);
        }

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

    return (
        <div className="card-wrapper px-3 pt-3">
            <ToastContainer />
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
            {/* <div className="flex justify-between items-center py-1">
                <PostShareButtons icon={<HiPhoto className='h-5 text-blue-500' />} label={'Photo'} />
                <PostShareButtons icon={<HiVideoCamera className='h-5 text-green-500' />} label={'Video'} />
                <PostShareButtons icon={<BsCalendarDate className='h-5 text-orange-500' />} label={'Audio Event'} />
                <PostShareButtons icon={<BsReverseLayoutTextSidebarReverse className='h-5 text-red-700' />} label={'Write Article'} />
            </div> */}
        </div>
    )
}

export default CreatePost