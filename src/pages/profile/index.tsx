import { collection, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import PostBox from "components/posts/PostBox";
import { AuthContext } from "context/AuthContext";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const DEFAULT_PROFILE = "/logo192.png";
type TabType = "my" | "like";

export default function Profile() {
    const [activeTab, setActiveTab] = useState<TabType>("my");
    const [myPosts, setMyPosts] = useState<PostProps[]>([]);
    const [likePosts, setLikePosts] = useState<PostProps[]>([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            let postRef = collection(db, "posts");
            const myPostQuery = query(
                postRef,
                where("uid", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            const likePostQuery = query(
                postRef,
                where("likes", "array-contains", user.uid),
                orderBy("createdAt", "desc")
            );
            onSnapshot(myPostQuery, (snapShot: any) => {
                let dataObj = snapShot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
                setMyPosts(dataObj as PostProps[]);
            });
            onSnapshot(likePostQuery, (snapShot: any) => {
                let dataObj = snapShot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
                setLikePosts(dataObj as PostProps[]);
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
                    <div
                        className={`home__tab ${activeTab === "my" ? "home__tab--active" : ""}`}
                        onClick={() => {
                            setActiveTab("my");
                        }}
                    >
                        For You
                    </div>
                    <div
                        className={`home__tab ${activeTab === "like" ? "home__tab--active" : ""}`}
                        onClick={() => {
                            setActiveTab("like");
                        }}
                    >
                        Likes
                    </div>
                </div>
            </div>
            {activeTab === "my" && (
                <div className="post">
                    {myPosts.length > 0 ? (
                        myPosts.map((post) => <PostBox post={post} key={post.id} />)
                    ) : (
                        <div className="post__no-posts">
                            <div className="post__text">게시글이 없습니다.</div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === "like" && (
                <div className="post">
                    {likePosts.length > 0 ? (
                        likePosts.map((post) => <PostBox post={post} key={post.id} />)
                    ) : (
                        <div className="post__no-posts">
                            <div className="post__text">게시글이 없습니다.</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
