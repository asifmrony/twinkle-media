import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { auth } from './Firebase';
import Home from './components/Home';
import Login from './components/Login';
import { login, logout, selectUser } from './features/userSlice';
import RequireAuth from './components/auth/RequireAuth';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';

function App() {

  return (
    <BrowserRouter>
      <>
        <div className="App bg-[#F3F2EF] min-h-screen">
          <Routes>
            <Route 
              path='/' 
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              } 
            />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/reset-password' element={<ResetPassword />} />
          </Routes>
        </div>
      </>
    </BrowserRouter>
  );
}

export default App;
