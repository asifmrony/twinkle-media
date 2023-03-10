import { uuidv4 } from "@firebase/util";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../Firebase";

export function useAddComment({ userId, postId }) {
    const [commentPosted, setCommentPosted] = useState(false)
    const [commentPostingError, setCommentPostingError] = useState(null)
    const id = uuidv4();

    async function addComment(text) {
        const cmntRef = doc(db, "comments", id)
        await setDoc(cmntRef, {
            userId,
            postId,
            id,
            message: text,
            date: Date.now()
        })
            .then(() => {
                setCommentPosted(true);
                toast.success('Comment added');
            })
            .catch((err) => {
                setCommentPostingError(err.message);
                toast.error(err.message)
            })
    }

    return { addComment, commentPosted, commentPostingError };
}

export function useComments(postId) {
    const [allComments, setAllComments] = useState([])
    const [commentLoading, setCommentLoading] = useState(true);
    const [commentFetchError, setCommentFetchError] = useState(false);
    const commentsRef = collection(db, "comments")

    useEffect(() => {
        const fetchComments = () => {
            const q = query(commentsRef, where("postId", "==", postId));
            onSnapshot(q, (snapshot) => {
                if (snapshot.size) {
                    setCommentLoading(false);
                    setAllComments(snapshot.docs.map((doc) => {
                        return {
                            ...doc.data(),
                            id: doc.id
                        }
                    }))
                } else {
                    setCommentLoading(false)
                }
            })
        }
        fetchComments()
    }, [])

    return { allComments, commentLoading, commentFetchError }
}

export function useDeleteComment(id) {
    const [deleteLoading, setDeleteLoading] = useState(false)

    function deleteComment() {
        console.log(id);
        const commentDoc = doc(db, 'comments', id);
        setDeleteLoading(true)
        deleteDoc(commentDoc)
            .then(() => {
                setDeleteLoading(false);
                toast.success("Comment Deleted");
            })
            .catch((err) => {
                toast.err("Error Deleting comment");
            });
    }

    return {deleteComment, deleteLoading};
}