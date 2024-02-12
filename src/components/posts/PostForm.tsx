import { AuthContext } from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

export default function PostForm() {
    const [content, setContent] = useState<string>("");
    const { user } = useContext(AuthContext);
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [hashTag, setHashTag] = useState<string>("");
    const handleFileUpload = () => {};

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {
            currentTarget: { value, name },
        } = e;

        if (name === "content") {
            setContent(value);
        }
    };

    const removeTag = (tag: string) => {
        setHashTags(hashTags.filter((val) => val !== tag));
    };
    const onChangeHashtag = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            currentTarget: { value },
        } = e;
        setHashTag(value?.trim());
    };
    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const {
            code,
            currentTarget: { value },
        } = e;
        if (code === "Space" && value?.trim() !== "") {
            if (hashTags.includes(value?.trim())) {
                toast.error("동일한 태그가 있습니다.");
            } else {
                setHashTags((pre) => [...(pre || []), value]);
                setHashTag("");
            }
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "posts"), {
                content,
                createdAt: new Date()?.toLocaleDateString("ko", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
                uid: user?.uid,
                email: user?.email,
                hashTags,
            });
            setHashTags([]);
            setHashTag("");
            setContent("");
            toast.success("게시글 생성");
        } catch (error) {
            console.error(error);
            toast.error("생성 실패");
        }
    };
    return (
        <form onSubmit={onSubmit} className="post-form">
            <textarea
                className="post-form__textarea"
                required
                name="content"
                id="content"
                placeholder="What is happening"
                value={content}
                onChange={onChange}
            />
            <div className="post-form__hashtags">
                <span className="post-form__hashtags-outputs">
                    {hashTags.map((tag, index) => (
                        <span
                            className="post-form__hashtags-tag"
                            key={index}
                            onClick={() => removeTag(tag)}
                        >
                            #{tag}
                        </span>
                    ))}
                </span>
                <input
                    type="text"
                    className="post-form__input"
                    name="hashtag"
                    id="hashtag"
                    placeholder="해시태그 + 스페이스바 입력"
                    onChange={onChangeHashtag}
                    onKeyUp={handleKeyUp}
                    value={hashTag}
                />
            </div>
            <div className="post-form__submit-area">
                <label htmlFor="file-input" className="post-form__file">
                    <FiImage className="post-form__file-icon" />
                </label>
                <input
                    type="file"
                    name="file-input"
                    accept="images/*"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <input type="submit" value="Tweet" className="post-form__submit-btn" />
            </div>
        </form>
    );
}
