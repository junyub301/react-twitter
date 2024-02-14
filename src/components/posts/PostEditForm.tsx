import { AuthContext } from "context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import PostHeader from "./PostHeader";

export default function PostEditForm() {
    const { id } = useParams();
    const [post, setPost] = useState<PostProps | null>(null);
    const [content, setContent] = useState<string>("");
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [hashTag, setHashTag] = useState<string>("");
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const getPost = useCallback(async () => {
        if (id) {
            const docRef = doc(db, "posts", id);
            const docSnap = await getDoc(docRef);
            setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
            setContent(docSnap?.data()?.content);
            setHashTags(docSnap?.data()?.hashTags);
            setImageFile(docSnap?.data()?.imageUrl);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getPost();
        }
    }, [getPost, id]);

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

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const key = `${user?.uid}/${uuidv4()}`;
        const storageRef = ref(storage, key);
        try {
            if (post && id) {
                if (post?.imageUrl) {
                    let imageRef = ref(storage, post?.imageUrl);
                    await deleteObject(imageRef).catch((error) => console.error(error));
                }

                let imageUrl = "";
                if (imageFile) {
                    const data = await uploadString(storageRef, imageFile, "data_url");
                    imageUrl = await getDownloadURL(data?.ref);
                }

                const postRef = doc(db, "posts", id);
                await updateDoc(postRef, { content, hashTags, imageUrl });
                navigate(`posts/${id}`);
                toast.success("수정 완료");
            }
            setImageFile(null);
            setIsSubmitting(false);
        } catch (error) {
            console.error(error);
            toast.error("수정 실패");
        }
    };
    return (
        <div className="post">
            <PostHeader />
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
                                    {" "}
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>
                    <input
                        type="submit"
                        value="수정"
                        className="post-form__submit-btn"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
}
