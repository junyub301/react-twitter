import { collection, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import PostBox from "components/posts/PostBox";
import { AuthContext } from "context/AuthContext";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const DEFAULT_PROFILE = "/logo192.png";

export default function Profile() {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            let postRef = collection(db, "posts");
            let postsQuery = query(
                postRef,
                where("uid", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            onSnapshot(postsQuery, (snapShot: any) => {
                let dataObj = snapShot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
                setPosts(dataObj as PostProps[]);
            });
        }
    }, [user]);

    return (
        <div className="home">
            <div className="home__top">
                <div className="home__title">Profile</div>
                <div className="profile">
                    <img
                        src={user?.photoURL || DEFAULT_PROFILE}
                        alt="profile"
                        className="profile__image"
                        width={100}
                        height={100}
                    />
                    <button
                        className="profile__btn"
                        type="button"
                        onClick={() => navigate("/profile/edit")}
                    >
                        프로필 수정
                    </button>
                </div>
                <div className="profile__text">
                    <div className="profile__name">{user?.displayName || "사용자님"}</div>
                    <div className="profile__email">{user?.email}</div>
                </div>
                <div className="home__tabs">
                    <div className="home__tab home__tab--active">For You</div>
                    <div className="home__tab">Likes</div>
                </div>
            </div>
            <div className="post">
                {posts.length > 0 ? (
                    posts.map((post) => <PostBox post={post} key={post.id} />)
                ) : (
                    <div className="post__no-posts">
                        <div className="post__text">게시글이 없습니다.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
