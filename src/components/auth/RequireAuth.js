import React from 'react'
import { Navigate } from 'react-router-dom';
import { auth } from '../../Firebase'

const user = auth.currentUser;
console.log(user);

function RequireAuth({ children }) {
    if(!user) {
        return <Navigate to={'/login'} />
    }

    return children;
}

export default RequireAuth