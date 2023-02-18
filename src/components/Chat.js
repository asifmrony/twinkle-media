import { useState } from 'react'
import { ChatContextProvider } from '../contexts/chatcontext';
import Main from './chat-components/Main'
import Sidebar from './chat-components/Sidebar'
import Header from './partials/Header'

export default function Chat() {
  const [activeChatUser, setCurrentChatUser] = useState({});
  const [activeChatId, setCurrentChatId] = useState('');

  return (
    <>
      <Header />
      <main className='container'>
        <section className='grid grid-cols-12 gap-x-4 mt-5'>
          <ChatContextProvider>
            {/* sidebar */}
            <Sidebar />
            {/* Currently Active chat conversation */}
            <Main />
          </ChatContextProvider>
        </section>
      </main>
    </>
  )
}
