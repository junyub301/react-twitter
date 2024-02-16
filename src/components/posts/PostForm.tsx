import { AuthContext } from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PostForm() {
    const [content, setContent] = useState<string>("");
    const { user } = useContext(AuthContext);
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [hashTag, setHashTag] = useState<string>("");
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const t = useTranslation();
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            currentTarget: { files },
        } = e;
        const file = files?.[0];
        const fileReader = new FileReader();
        if (file) {
            fileReader?.readAsDataURL(file);
            fileReader.onload = (e: any) => {
                const { result } = e?.currentTarget;
                setImageFile(result);
            };
        }
    };

    const handleDeleteImage = () => {
        setImageFile(null);
    };

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
        setIsSubmitting(true);
        const key = `${user?.uid}/${uuidv4()}`;
        const storageRef = ref(storage, key);
        e.preventDefault();
        try {
            let imageUrl = "";
            if (imageFile) {
                const data = await uploadString(storageRef, imageFile, "data_url");
                imageUrl = await getDownloadURL(data?.ref);
            }

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
                imageUrl,
            });
            setHashTags([]);
            setHashTag("");
            setContent("");
            setImageFile(null);
            toast.success("게시글 생성");
        } catch (error) {
            console.error(error);
            toast.error("생성 실패");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={onSubmit} className="post-form">
            <textarea
                className="post-form__textarea"
                required
                name="content"
                id="content"
                placeholder={t("POST_PLACEHOLDER")}
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
                    placeholder={t("POST_HASHTAG")}
                    onChange={onChangeHashtag}
                    onKeyUp={handleKeyUp}
                    value={hashTag}
                />
            </div>
            <div className="post-form__submit-area">
                <div className="post-form__image-area">
                    <label htmlFor="file-input" className="post-form__file">
                        <FiImage className="post-form__file-icon" />
                    </label>
                    <input
                        type="file"
                        name="file-input"
                        id="file-input"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    {imageFile && (
                        <div className="post-form__attachment">
                            <img src={imageFile} alt="attachment" width={100} height={100} />
                            <button
                                className="post-form__clear-btn"
                                type="button"
                                onClick={handleDeleteImage}
                            >
                                {t("BUTTON_DELETE")}
                            </button>
                        </div>
                    )}
                </div>

                <input
                    type="submit"
                    value="Tweet"
                    className="post-form__submit-btn"
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
}
