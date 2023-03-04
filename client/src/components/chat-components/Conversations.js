import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice'


export default function Conversations({ messages }) {
    const currentUser = useSelector(selectUser);

    const formatTime = (date) => {
        // return formatDistanceToNow(date.toDate()) + ' ago';
        return date.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <>
            {messages?.map((msg) => (
                msg.senderId === currentUser.uid ?
                    <div className="right-side space-y-1 w-[50%] ml-auto" key={msg.id}>
                        {msg.image ?
                            <div key={msg.id}>
                                <img src={msg.image} className='max-h-40 ml-auto' alt="Message containing images" />
                            </div>
                            :
                            <div className='text-right'>
                                <p className='text-[#4E4E4E] text-xs mb-1 ml-1 text-right'>{formatTime(msg.date)}</p>
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
                                <p className='text-[#4E4E4E] text-xs mb-1 ml-1'>{formatTime(msg.date)}</p>
                                <p className='p-2 bg-white rounded-lg rounded-tl-none inline-block text-sm'>{msg.text}</p>
                            </div>
                        }
                    </div>
            ))}
            </>
    )
}
