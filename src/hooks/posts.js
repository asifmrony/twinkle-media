import { uuidv4 } from "@firebase/util";
import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../Firebase";

export function useAddPost() {
    const [isLoading, setLoading] = useState(false);
    const [postCreated, setPostCreated] = useState(false);
    const [isError, setError] = useState(null);
    
    async function addPost(post) {
        const id = uuidv4();
        const postsRef = doc(db, 'posts', id)
        setLoading(true);
        //firebase addDoc method can also be used instead of setDoc
        await setDoc(postsRef, {
           ...post,
           id,
           date: Date.now(),
           likes: []
        }).then(() => {
            setPostCreated(true)
        }).catch((err) => {
            console.log(err);
            setError(err.message);
        })
        setLoading(false)
    }

  return { addPost, isLoading, postCreated, isError }
}

export function useToggleLike({postId, isLiked, uid}) {
    const [isLoading, setLoading] = useState(false);

    async function toggleLike() {
        setLoading(false);
        const docRef = doc(db, "posts", postId);
        await updateDoc(docRef, {
            likes: isLiked ? arrayRemove(uid) : arrayUnion(uid)   
        }) 
        setLoading(false);
    }

    return { toggleLike, isLoading }
}
