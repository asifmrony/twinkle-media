/**
 * This Component can be used to get logged in user.
 * Not needed, since we are using redux for global state observer.
 * Purpose: occasionally check backend authenticated user.
 */
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../../Firebase'

export function useAuth() {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //user is signed in
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        })
    }, [])

    return { currentUser };
}