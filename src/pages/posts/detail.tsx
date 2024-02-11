import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<PostProps | null>(null);
    const navigate = useNavigate();
    const getPost = useCallback(async () => {
        if (id) {
            const docRef = doc(db, "posts", id);
            const docSnap = await getDoc(docRef);
            setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getPost();
        }
    }, [getPost, id]);

    return (
        <div className="post">
            <div className="post__header">
                <button type="button" onClick={() => navigate(-1)}>
                    <IoIosArrowBack className="post__header-btn" />
                </button>
            </div>
            {post ? <PostBox post={post} /> : <Loader />}
        </div>
    );
}
