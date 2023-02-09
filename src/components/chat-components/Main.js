import { Link } from 'react-router-dom'
import { BsThreeDots, BsEmojiSmile } from 'react-icons/bs'
import { MdAttachFile } from 'react-icons/md'
import { FaPaperPlane } from 'react-icons/fa'
import { useRef } from 'react'

export default function Main() {
    const fileAttachmentRef = useRef(null);
    const handleAttachmentUpload = (e) => {
        console.log(e.target.files[0]);
    }

    return (
        <div className='col-span-8 bg-[#ECF1FF] border border-white h-[500px]'>
            {/* Message Header */}
            <div className='header flex justify-between items-center bg-white py-3 px-4 pr-6'>
                <div className='flex gap-x-1 items-center'>
                    <div className='w-[53px] h-[53px] bg-white rounded-full p-[2px] mr-3'>
                        <Link to={`/profile`} className="post-insider-link">
                            <img src={'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="" className='w-full h-full rounded-full' />
                        </Link>
                    </div>
                    <div>
                        <h1 className='font-semibold'>Emma Watson</h1>
                        <p className='text-sm font-light'>+8801793726776</p>
                    </div>
                </div>
                <BsThreeDots className='h-6 w-6 text-slate-600' />
            </div>
            {/* All Messages */}
            <div className='h-[75%] px-5 py-3 overflow-y-auto'>
                <div className="left-side space-y-1 w-[50%] mr-auto mb-4">
                    <div>
                        <p className='text-[#4E4E4E] text-xs mb-1 ml-1'>8:30 AM</p>
                        <p className='p-2 bg-white rounded-lg rounded-tl-none inline-block text-sm'>whats up, man?</p>
                    </div>
                    <div>
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
                    </div>
                </div>
                <div className="right-side space-y-1 w-[50%] ml-auto">
                    <div className='text-right'>
                        <p className='text-[#4E4E4E] text-xs mb-1 ml-1 text-right'>8:30 AM</p>
                        <p className='p-2 bg-[#58668F] rounded-br-none text-white rounded-lg inline-block text-sm'>
                            Hi man, Whats going on ?
                        </p>
                    </div>
                    <div className='text-right'>
                        <p className='text-[#4E4E4E] text-xs mb-1 ml-1 text-right'>8:50 AM</p>
                        <p className='p-2 bg-[#58668F] rounded-br-none text-white rounded-lg inline-block text-sm'>
                        Can you help me with the situation
                        </p>
                    </div>
                    <div className='text-right'>
                        <p className='text-[#4E4E4E] text-xs mb-1 ml-1 text-right'>8:50 AM</p>
                        <p className='p-2 bg-[#58668F] rounded-br-none text-white rounded-lg inline-block text-sm'>
                            Anything else do you need from me that i am aware to okay and think about in a bit more details
                        </p>
                    </div>
                    
                </div>
            </div>
            {/* Message Type and Send */}
            <div className="bg-white py-3 px-4">
                <div className="relative">
                    <input type="text" className='w-full py-3 pl-12 pr-24 rounded-full bg-[#fafbfd] outline-[#d8dcf1]' placeholder='Type your messages here' />
                    <BsEmojiSmile className='absolute top-3.5 left-4 w-5 h-5 text-slate-500' />
                    <input type="file" accept="image/*" className="hidden" ref={fileAttachmentRef} name="fileInput" id="profilePicButton" onChange={handleAttachmentUpload} />
                    <label htmlFor="profilePicButton">
                        <button type="button"
                            className="p-2 hover:bg-gray-200 rounded-full absolute right-14 top-1.5"
                            onClick={e => fileAttachmentRef.current && fileAttachmentRef.current.click()}
                        >
                            <MdAttachFile className="h-5 w-5 text-slate-600" />
                        </button>
                    </label>

                    <button className='w-12 h-12 rounded-full bg-[#1C57FF] text-white flex justify-center items-center absolute top-0 right-0'>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    )
}
