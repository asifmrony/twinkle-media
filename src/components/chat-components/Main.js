import { Link } from 'react-router-dom'
import { BsThreeDots, BsEmojiSmile } from 'react-icons/bs'
import { MdAttachFile } from 'react-icons/md'
import { FaPaperPlane } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectChatId, selectChatUser, selectUser } from '../../features/userSlice'
import { arrayUnion, doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../Firebase'
import { uuidv4 } from '@firebase/util'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { toast } from 'react-toastify'
import { useChatScroll } from '../../hooks/scrollToBottom'

export default function Main() {
    const fileAttachmentRef = useRef(null);
    const currentUser = useSelector(selectUser);
    const activeChatUser = useSelector(selectChatUser);
    const activeChatId = useSelector(selectChatId);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const id = uuidv4();
    const scrollToBottom = useChatScroll(messages);

    console.log(activeChatId);

    useEffect(() => {
        const unsub = () => {
            onSnapshot(doc(db, "chats", activeChatId), (doc) => {
                doc.exists() && setMessages(doc.data().messages);
            })
            console.log("Active id on effect", activeChatId)
        }

        return () => {
            unsub();
        }
    }, [activeChatId])

    console.log(messages);

    const handleSend = async () => {
        if(!input) {
            alert('Write something in the message box');
            return;
        }
        if (image) {
            const storageRef = ref(storage, `chat-images/${image.name}`)
            const uploadTask = uploadBytesResumable(storageRef, image);

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
                    toast.error('Error Sending image, Try Again!', { theme: "colored" });
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        console.log('File available at', downloadURL);
                        await updateDoc(doc(db, "chats", activeChatId), {
                            messages: arrayUnion({
                                id: id,
                                text: input,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                image: downloadURL
                            })
                        })
                    });
                    toast.success("Image Sent", { theme: "colored" })
                    setInput('');
                    setImage(null);
                }
            );
        } else {
            await updateDoc(doc(db, "chats", activeChatId), {
                messages: arrayUnion({
                    id: id,
                    text: input,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
            setInput('');
        }
    }

    return (
        <div className='col-span-8 bg-[#ECF1FF] border border-white h-[500px]'>
            {/* Message Header */}
            <div className='header flex justify-between items-center bg-white py-3 px-4 pr-6'>
                <div className='flex gap-x-1 items-center'>
                    <div className='w-[53px] h-[53px] bg-white rounded-full p-[2px] mr-3'>
                        <Link to={`/profile`} className="post-insider-link">
                            <img src={activeChatUser?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                        </Link>
                    </div>
                    <div>
                        <h1 className='font-semibold'>{activeChatUser?.displayName}</h1>
                        {/* <p className='text-sm font-light'>+8801793726776</p> */}
                    </div>
                </div>
                <BsThreeDots className='h-6 w-6 text-slate-600' />
            </div>
            {/* All Messages */}
            <div className='h-[75%] px-5 py-3 overflow-y-auto' ref={scrollToBottom}>
                {messages?.map((msg) => (
                    msg.senderId === currentUser.uid ?
                        <div className="right-side space-y-1 w-[50%] ml-auto" key={msg.id}>
                            {msg.image ?
                                <div key={msg.id}>
                                    <img src={msg.image} className='max-h-40 ml-auto' alt="Message containing images" />
                                </div>
                                :
                                <div className='text-right'>
                                    <p className='text-[#4E4E4E] text-xs mb-1 ml-1 text-right'>8:30 AM</p>
                                    <p className='p-2 bg-[#58668F] rounded-br-none text-white rounded-lg inline-block text-sm'>
                                        {msg.text}
                                    </p>
                                </div>
                            }
                        </div>
                        :
                        <div className="left-side space-y-1 w-[50%] mr-auto mb-4" key={msg.id}>
                            {msg.image ?
                                <div key={msg.id}>
                                    <img className='max-h-40 mr-auto' src={msg.image} alt="Message containing images" />
                                </div>
                                :
                                <div>
                                    <p className='text-[#4E4E4E] text-xs mb-1 ml-1'>8:30 AM</p>
                                    <p className='p-2 bg-white rounded-lg rounded-tl-none inline-block text-sm'>{msg.text}</p>
                                </div>
                            }
                        </div>
                ))}
                {/* <div>
                        <p className='p-2 bg-white rounded-lg rounded-tl-none inline-block text-sm'>
                            I am not that much good, recent time its very hard
                            time going on
                        </p>
                    </div>
                    <div>
                        <p className='p-2 bg-white rounded-lg rounded-tl-none inline-block text-sm'>
                            Lets see, How I can manage the situation right here
                            on board
                        </p>
                    </div> */}
                {/* <div className="right-side space-y-1 w-[50%] ml-auto">
                    <div className='text-right'>
                        <p className='text-[#4E4E4E] text-xs mb-1 ml-1 text-right'>8:30 AM</p>
                        <p className='p-2 bg-[#58668F] rounded-br-none text-white rounded-lg inline-block text-sm'>
                            Hi man, Whats going on ?
                        </p>
                    </div>
                </div> */}

            </div>
            {/* Message Type and Send */}
            <div className="bg-white py-3 px-4">
                <div className="relative">
                    <input
                        type="text"
                        className='w-full py-3 pl-12 pr-24 rounded-full bg-[#fafbfd] outline-[#d8dcf1]'
                        placeholder='Type your messages here'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <BsEmojiSmile className='absolute top-3.5 left-4 w-5 h-5 text-slate-500' />
                    <input type="file" accept="image/*" className="hidden" ref={fileAttachmentRef} name="fileInput" id="profilePicButton" onChange={(e) => setImage(e.target.files[0])} />
                    <label htmlFor="profilePicButton">
                        <button type="button"
                            className="p-2 hover:bg-gray-200 rounded-full absolute right-14 top-1.5"
                            onClick={e => fileAttachmentRef.current && fileAttachmentRef.current.click()}
                        >
                            <MdAttachFile className="h-5 w-5 text-slate-600" />
                        </button>
                    </label>

                    <button onClick={handleSend} className='w-12 h-12 rounded-full bg-[#1C57FF] text-white flex justify-center items-center absolute top-0 right-0'>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    )
}
