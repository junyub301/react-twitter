import { AuthContext } from "context/AuthContext";
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { FaCircleUser, FaHeart, FaRegComment } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
    post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleDelete = async () => {
        const ok = window.confirm("삭제 하시겠습니까?");
        if (ok) {
            const imageRef = ref(storage, post?.imageUrl);
            if (post.imageUrl) {
                deleteObject(imageRef)
                    .then(() => console.log("삭제"))
                    .catch((error) => console.error(error));
            }

            await deleteDoc(doc(db, "posts", post.id));
            toast.success("게시글 삭제");
            navigate("/");
        }
    };

    const toggleLike = async () => {
        const postRef = doc(db, "posts", post.id);
        if (user?.uid && post.likes?.includes(user.uid)) {
            await updateDoc(postRef, {
                likes: arrayRemove(user.uid),
                likeCount: post?.likeCount ? post.likeCount - 1 : 0,
            });
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(user?.uid),
                likeCount: post?.likeCount ? post.likeCount + 1 : 1,
            });
        }
    };
    return (
        <div className="post__box" key={post.id}>
            <Link to={`/posts/${post.id}`}>
                <div className="post__box-profile">
                    <div className="post__flex">
                        {post?.profileUrl ? (
                            <img
                                src={post?.profileUrl}
                                alt="profile"
                                className="post__box-profile-img"
                            />
                        ) : (
                            <FaCircleUser className="post__box-profile-icon" />
                        )}
                        <div className="post__email">{post.email}</div>
                        <div className="post__createdAt">{post.createdAt}</div>
                    </div>
                    <div className="post__box-content">{post.content}</div>
                    {post?.imageUrl && (
                        <div className="post__image-div">
                            <img
                                src={post.imageUrl}
                                alt="post_image"
                                className="post__image"
                                width={100}
                                height={100}
                            />
                        </div>
                    )}
                    <div className="post-form__hashtags-outputs">
                        {post?.hashTags?.map((tag, index) => (
                            <span className="post-form__hashtags-tag" key={index}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
            <div className="post__box-footer">
                {user?.uid === post.uid && (
                    <>
                        <button type="button" className="post__delete" onClick={handleDelete}>
                            Delete
                        </button>
                        <button type="button" className="post__edit">
                            <Link to={`/posts/edit/${post.id}`}>Edit</Link>
                        </button>
                    </>
                )}
                <button type="button" className="post__likes" onClick={toggleLike}>
                    {user && post?.likes?.includes(user.uid) ? <FaHeart /> : <FaRegHeart />}
                    {post?.likeCount || 0}
                </button>
                <button type="button" className="post__comments">
                    <FaRegComment />
                    {post.comments?.length || 0}
                </button>
            </div>
        </div>
    );
}
