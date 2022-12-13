import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login, logout, selectUser } from '../../features/userSlice';
import { auth } from '../../Firebase';
import useAuth from './useAuth';

function RequireAuth({ children }) {
    const currentUser = useAuth();
    
    if (!currentUser) {
        return <Navigate to={'/login'} />
    }

    return children;
}

export default RequireAuth