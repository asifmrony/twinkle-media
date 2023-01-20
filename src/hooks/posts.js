import { uuidv4 } from "@firebase/util";
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
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
    console.log(postId, isLiked, uid);

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

//TO-DO: Custom hook for loading all posts

// Loads single post
export function usePost(id) {
    const [post, setPost] = useState({});
    const [postLoading, setPostLoading] = useState(true);
    const docRef = doc(db, "posts", id);

    useEffect(() => {
        async function getPost() {
            // setPostLoading(true);
            onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setPost(doc.data());
                } else {
                    console.log("Post not found");
                }
            })
            setPostLoading(false);
        }
        getPost();
    }, [])

    return {post, postLoading};
}

//Edits single post
export function useUpdatePost() {
    const [isError, setError] = useState('');
    const [postUpdated, setPostUpdated] = useState(false);

    function updatePost(id, updatedMessage) {
        const postDoc = doc(db, 'posts', id);
        // Edited message as update post data
        const newMessage = { message: updatedMessage }
        updateDoc(postDoc, newMessage)
            .then(() => {
                setPostUpdated(true);
            })
            .catch((err) => {
                setPostUpdated(false);
                setError(err.message);
            });
    }

    return {updatePost, postUpdated, isError}
}

//Deletes single post
export function useDeletePost() {
    const [isError, setError] = useState('');
    const [postDeleted, setPostDeleted] = useState(false);

    function deletePost(id) {
        const postDoc = doc(db, 'posts', id);
        deleteDoc(postDoc)
            .then(() => {
                setPostDeleted(true);
            })
            .catch((err) => {
                setPostDeleted(false);
                setError(err.message);
            });
    }

    return {deletePost, postDeleted, isError}
}

// Loads Post Author: passing in Post Id
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