import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Feed from './components/Feed';
import { auth } from './components/Firebase';
import Header from './components/Header';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Widgets from './components/Widgets';
import { login, logout, selectUser } from './features/userSlice';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (loggedInuser) => {
      if (loggedInuser) {
        //user is signed in
        dispatch(login({
          email: loggedInuser.email,
          uid: loggedInuser.uid,
          displayName: loggedInuser.displayName,
          photoURL: loggedInuser.photoURL
        }))
      } else {
        //user is signed out
        dispatch(logout());
      }
    });
  }, [])

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
