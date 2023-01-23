import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../Firebase";

// Loads Post Author/Profile info: passing in userId
export function usePostAuthor(id) {
    const [postAuthor, setPostAuthor] = useState({})
    const [authorLoading, setAuthorLoading] = useState(false)

    useEffect(() => {
        const getPostAuthor = async () => {
            setAuthorLoading(true);
            const docSnap = await getDoc(doc(db, "users", id))
            if(docSnap.exists()) {
                setPostAuthor(docSnap.data());
            } else {
                console.log('No Post Author Found');
            }
            setAuthorLoading(false);
        }
        getPostAuthor()
      
    }, [id])

    return { postAuthor, authorLoading }
}

export function useUpdateBio(id) {
    const [bioUpdated, setBioUpdated] = useState(false);

    async function updateBio(authorBio) {
        const authorRef = doc(db, "users", id);
        try {
            await updateDoc(authorRef, {
                bio: authorBio
            })
            toast('Bio Updated');
        } catch (error) {
            toast.error('Error Updating Bio');
            throw new Error();
        } finally {
            setBioUpdated(true);
        }
    }

    return { updateBio, bioUpdated }
}