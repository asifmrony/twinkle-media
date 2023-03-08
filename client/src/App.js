import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { auth } from './Firebase';
import Home from './components/Home';
import Login from './components/Login';
import RequireAuth from './components/auth/RequireAuth';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import PostDetails from './components/PostDetails';
import Network from './components/Network';
import Chat from './components/Chat';
import ErrorPage from './utils/error-page';
import { selectSocket, selectUser } from './features/userSlice';
import Header from './components/partials/Header';

function App() {
  const currentUser = useSelector(selectUser);
  const socket = useSelector(selectSocket);

  useEffect(() => {
    if(currentUser && socket) {
      socket?.emit("newUser", currentUser?.displayName)
    }
  }, [socket, currentUser?.displayName])

  return (
    <BrowserRouter>
      <>
        <div className="App bg-[#F3F2EF] min-h-screen">
          <Routes>
            <Route path='/' element={<RequireAuth><Home /></RequireAuth>} />
            {/* <Route index element={} /> */}
            <Route path='profile/:id' element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path='post/:id' element={<RequireAuth><PostDetails /></RequireAuth>} />
            <Route path='network' element={<RequireAuth><Network /></RequireAuth>} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path='reset-password' element={<ResetPassword />} />
            <Route path='chat' element={<RequireAuth><Chat /></RequireAuth>} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </div>
      </>
    </BrowserRouter>
  );
}

export default App;
