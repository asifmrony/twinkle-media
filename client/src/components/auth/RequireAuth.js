import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login, logout, selectUser } from '../../features/userSlice';
import { auth } from '../../Firebase';
import Header from '../partials/Header';
import useAuth from './useAuth';

function RequireAuth({ children }) {
    // const currentUser = useAuth();
    const currentUser = useSelector(selectUser);
    
    if (!currentUser) {
        return <Navigate to={'/login'} />
    }

    return <>
        <Header />
        {children}
    </>;
}

export default RequireAuth