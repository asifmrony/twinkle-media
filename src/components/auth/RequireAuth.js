import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../../features/userSlice';
import { auth } from '../../Firebase'

function RequireAuth({ children }) {
    const user = useSelector(selectUser);
    console.log(user);
    if(!user) {
        return <Navigate to={'/login'} />
    }

    return children;
}

export default RequireAuth