import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../Firebase";

// Loads Post Author/Profile info: passing in userId
export function usePostAuthor(id) {
    const [postAuthor, setPostAuthor] = useState({});
    const [authorLoading, setAuthorLoading] = useState(false);
    const [errorObj, setError] = useState();

    useEffect(() => {
        const getPostAuthor = async () => {
            setAuthorLoading(true);
            try {
                // const docSnap = await getDoc(doc(db, "users", id))
                // if (docSnap.exists()) {
                //     setPostAuthor(docSnap.data());
                // } else {
                //     console.log('No Post Author Found');
                // }
                const authorRef = doc(db, "users", id);
                onSnapshot(authorRef, (doc) => {
                  if(doc.exists()) {
                    setPostAuthor(doc.data());
                  } else {
                    console.log("No Post Author Found")
                  }
                })
            } catch (error) {
                setAuthorLoading(false);
                setError(error);
            }
            setAuthorLoading(false);
        }
        getPostAuthor()

    }, [id])

    return { postAuthor, authorLoading, errorObj }
}

export function useUpdateAuthor(id) {
    const [authorUpdated, setAuthorUpdated] = useState(false);

    async function updateAuthor(authorData) {
        const authorRef = doc(db, "users", id);
        try {
            await updateDoc(authorRef, authorData);
        } catch (error) {
            toast.error('Error Updating Bio');
            throw new Error();
        } finally {
            setAuthorUpdated(true);
        }
    }

    return { updateAuthor, authorUpdated }
}

// Get All posts of a single user: passing in userID
/**
 * TO-DO: This hook is copy version of useAllPosts hook, 
 * try modifying useAllPosts hook to reuse for Profile feed and Main feed.
 */
export function useAuthorPosts(userId) {
    const [allPosts, setAllPosts] = useState([]);
    const [feedLoading, setFeedLoading] = useState(true)
    const [feedError, setFeedError] = useState(null)
    const postsRef = collection(db, 'posts');

    useEffect(() => {
        const subscribe = () => {
          const q = query(postsRef, where('userId', "==", userId));
          onSnapshot(q, (snapshot) => {
            if(snapshot.size) {
              setFeedLoading(false);
              setAllPosts(snapshot.docs.map((doc) => {
                return {
                  ...doc.data(),
                  id: doc.id
                }
              }))
            } else {
              setFeedLoading(false)
            }
          })
        }
        subscribe();
        return () => {
          subscribe()
        }
      }, [])

      return { allPosts, feedLoading, feedError }
}