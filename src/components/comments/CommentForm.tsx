import { AuthContext } from "context/AuthContext";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export interface CommentFormProps {
    post: PostProps | null;
}
export default function CommentForm({ post }: CommentFormProps) {
    const [comment, setComment] = useState<string>("");
    const { user } = useContext(AuthContext);
    const t = useTranslation();

    const truncate = (str: string) => {
        return str.length > 10 ? str?.substring(0, 10) + "..." : str;
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {
            currentTarget: { value },
        } = e;
        setComment(value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (post) {
            try {
                const postRef = doc(db, "posts", post?.id);
                const commentObj = {
                    comment,
                    uid: user?.uid,
                    createdAt: new Date().toLocaleDateString("ko", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }),
                    email: user?.email,
                };

                await updateDoc(postRef, {
                    comments: arrayUnion(commentObj),
                });
                if (user?.uid !== post.uid) {
                    await addDoc(collection(db, "notifications"), {
                        createdAt: new Date().toLocaleDateString("ko", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        }),
                        uid: post?.uid,
                        isRead: false,
                        url: `/posts/${post.id}`,
                        content: `"${truncate(post.content)}" 글에 댓글이 작성되었습니다. `,
                    });
                }

                toast.success("댓글 생성");
                setComment("");
            } catch (error) {
                console.error(error);
                toast.error("댓글 생성 실패");
            }
        }
    };
    return (
        <form onSubmit={onSubmit} className="post-form">
            <textarea
                name="comment"
                id="comment"
                className="post-form__textarea"
                placeholder={t("POST_PLACEHOLDER")}
                value={comment}
                onChange={onChange}
            />
            <div className="post-form__submit-area">
                <div />
                <input
                    type="submit"
                    value={t("BUTTON_COMMENT")}
                    className="post-form__submit-btn"
                    disabled={!comment}
                />
            </div>
        </form>
    );
}
