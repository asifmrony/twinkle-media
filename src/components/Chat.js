import Main from './chat-components/Main'
import Sidebar from './chat-components/Sidebar'
import Header from './partials/Header'

export default function Chat() {
  return (
    <>
      <Header />
      <main className='container'>
        <section className='grid grid-cols-12 gap-x-4 mt-5'>
          {/* sidebar */}
          <Sidebar />
          {/* Currently Active chat conversation */}
          <Main />
        </section>
      </main>
    </>
  )
}
