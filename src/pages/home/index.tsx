import PostBox from "components/posts/PostBox";
import PostForm from "components/posts/PostForm";
import { useCallback, useContext, useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, doc, where } from "firebase/firestore";
import { AuthContext } from "context/AuthContext";
import { db } from "firebaseApp";
import { CommentProps } from "components/comments/CommentBox";
import useTranslation from "hooks/useTranslation";

export interface PostProps {
    id: string;
    email: string;
    content: string;
    createdAt: string;
    uid: string;
    profileUrl?: string;
    likes?: string[];
    likeCount?: number;
    comments?: CommentProps[];
    hashTags?: string[];
    imageUrl?: string;
}

type tabType = "all" | "following";

export default function Home() {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [followingPost, setFollowingPost] = useState<PostProps[]>([]);
    const [followingIds, setFollowingIds] = useState<string[]>([""]);
    const [activeTab, setActiveTap] = useState<tabType>("all");
    const { user } = useContext(AuthContext);
    const t = useTranslation();
    const getFollowingIds = useCallback(() => {
        if (user?.uid) {
            const ref = doc(db, "following", user.uid);
            onSnapshot(ref, (doc) => {
                setFollowingIds([""]);
                doc?.data()?.users?.map((user: { id: string }) =>
                    setFollowingIds((pre) => [...pre, user.id])
                );
            });
        }
    }, []);

    useEffect(() => {
        if (user?.uid) {
            getFollowingIds();
        }
    }, [getFollowingIds, user?.uid]);

    useEffect(() => {
        if (user) {
            let postRef = collection(db, "posts");
            let postsQuery = query(postRef, orderBy("createdAt", "desc"));
            let followingQuery = query(
                postRef,
                where("uid", "in", followingIds),
                orderBy("createdAt", "desc")
            );
            onSnapshot(postsQuery, (snapShot: any) => {
                let dataObj = snapShot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
                setPosts(dataObj as PostProps[]);
            });
            onSnapshot(followingQuery, (snapShot: any) => {
                let dataObj = snapShot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
                setFollowingPost(dataObj as PostProps[]);
            });
        }
    }, [user, followingIds]);
    return (
        <div className="home">
            <div className="home__top">
                <div className="home__title">{t("MENU_HOME")}</div>
                <div className="home__tabs">
                    <div
                        className={`home__tab ${activeTab === "all" ? "home__tab--active" : ""}`}
                        onClick={() => {
                            setActiveTap("all");
                        }}
                    >
                        {t("TAB_ALL")}
                    </div>
                    <div
                        className={`home__tab ${
                            activeTab === "following" ? "home__tab--active" : ""
                        }`}
                        onClick={() => {
                            setActiveTap("following");
                        }}
                    >
                        {t("TAB_FOLLOWING")}
                    </div>
                </div>
            </div>
            <PostForm />
            {activeTab === "all" && (
                <div className="post">
                    {posts.length > 0 ? (
                        posts.map((post) => <PostBox post={post} key={post.id} />)
                    ) : (
                        <div className="post__no-posts">
                            <div className="post__text">{t("NO_POSTS")}</div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === "following" && (
                <div className="post">
                    {followingPost.length > 0 ? (
                        followingPost.map((post) => <PostBox post={post} key={post.id} />)
                    ) : (
                        <div className="post__no-posts">
                            <div className="post__text">{t("NO_POSTS")}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
