import React from 'react';
import { useSelector } from 'react-redux';
import Feed from './components/Feed';
import Header from './components/Header';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Widgets from './components/Widgets';
import { selectUser } from './features/userSlice';

function App() {
  const user = useSelector(selectUser);

  return (
    <div className="App bg-[#F3F2EF] min-h-screen">
      {!user ? <Login /> :
        <>
          {/* Header */}
          <Header />

          {/* Main Section */}
          <main className='container'>
            <section className='grid grid-cols-12 gap-x-4 mt-5'>
              {/* sidebar */}
              <Sidebar />
              {/* Feed */}
              <Feed />
              {/* Widgets */}
              <Widgets />
            </section>
          </main>
        </>
      }
    </div>
  );
}

export default App;
