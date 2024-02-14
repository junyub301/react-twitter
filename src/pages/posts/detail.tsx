import CommentBox, { CommentProps } from "components/comments/CommentBox";
import CommentForm from "components/comments/CommentForm";
import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import PostHeader from "components/posts/PostHeader";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<PostProps | null>(null);
    const getPost = useCallback(async () => {
        if (id) {
            const docRef = doc(db, "posts", id);
            onSnapshot(docRef, (doc) => {
                setPost({ ...(doc?.data() as PostProps), id: doc.id });
            });
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getPost();
        }
    }, [getPost, id]);

    return (
        <div className="post">
            <PostHeader />
            {post ? (
                <>
                    <PostBox post={post} />
                    <CommentForm post={post} />
                    {post.comments
                        ?.slice(0)
                        ?.reverse()
                        ?.map((data: CommentProps, index: number) => (
                            <CommentBox data={data} key={index} post={post} />
                        ))}
                </>
            ) : (
                <Loader />
            )}
        </div>
    );
}
