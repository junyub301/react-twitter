import { AuthContext } from "context/AuthContext";
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingBoxProps {
    post: PostProps;
}

interface UserProps {
    id: string;
}
export default function FollowingBox({ post }: FollowingBoxProps) {
    const { user } = useContext(AuthContext);

    const [postFollowers, setPostFollowers] = useState<any>([]);

    const getFollowers = useCallback(async () => {
        if (post.uid) {
            const ref = doc(db, "follower", post.uid);
            onSnapshot(ref, (doc) => {
                setPostFollowers([]);
                doc?.data()?.users?.map((user: UserProps) =>
                    setPostFollowers((prev: UserProps[]) => (prev ? [...prev, user?.id] : []))
                );
            });
        }
    }, [post.uid]);

    useEffect(() => {
        if (post.uid) getFollowers();
    }, [getFollowers, post.uid]);

    const onClickFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            if (user?.uid) {
                const followingRef = doc(db, "following", user?.uid);

                await setDoc(
                    followingRef,
                    {
                        users: arrayUnion({ id: post?.uid }),
                    },
                    { merge: true }
                );
                const followerRef = doc(db, "follower", post?.uid);
                await setDoc(
                    followerRef,
                    {
                        users: arrayUnion({ id: user?.uid }),
                    },
                    { merge: true }
                );

                if (user?.uid !== post.uid) {
                    await addDoc(collection(db, "notifications"), {
                        createdAt: new Date().toLocaleDateString("ko", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        }),
                        uid: post?.uid,
                        isRead: false,
                        url: ``,
                        content: `"${user.email || user.displayName}"가 팔로우를 했습니다.`,
                    });
                }

                toast.success("팔로우");
            }
        } catch (error) {}
    };

    const onClickDeleteFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            if (user?.uid) {
                const followingRef = doc(db, "following", user.uid);

                await updateDoc(followingRef, {
                    users: arrayRemove({ id: post?.uid }),
                });
                const followerRef = doc(db, "follower", post?.uid);
                await updateDoc(followerRef, {
                    users: arrayRemove({ id: user.uid }),
                });
                toast.success("팔로우 취소");
            }
        } catch (error) {}
    };
    return (
        <>
            {user?.uid !== post?.uid &&
                (postFollowers?.includes(user?.uid) ? (
                    <button
                        type="button"
                        className="post__following-btn"
                        onClick={onClickDeleteFollow}
                    >
                        Following
                    </button>
                ) : (
                    <button type="button" className="post__follow-btn" onClick={onClickFollow}>
                        Follower
                    </button>
                ))}
        </>
    );
}
