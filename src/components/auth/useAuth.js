import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../../Firebase'

const useAuth = () => {
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

  return currentUser;
}

export default useAuth