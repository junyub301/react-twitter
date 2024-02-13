import { updateProfile } from "@firebase/auth";
import { deleteObject, getDownloadURL, ref, uploadString } from "@firebase/storage";
import PostHeader from "components/posts/PostHeader";
import { AuthContext } from "context/AuthContext";
import { storage } from "firebaseApp";
import { useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const STORAGE_DOWNLOAD_URL_STR = "https://firebasestorage.googleapis.com";

export default function ProfileEdit() {
    const [displayName, setDisplayName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.photoURL) {
            setImageUrl(user.photoURL);
        }
        if (user?.displayName) {
            setDisplayName(user.displayName);
        }
    }, [user?.photoURL]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            currentTarget: { value },
        } = e;

        setDisplayName(value);
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
                setImageUrl(result);
            };
        }
    };
    const handleDeleteImage = () => {
        setImageUrl(null);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const key = `${user?.uid}/${uuidv4()}`;
        const storageRef = ref(storage, key);
        let newImageUrl = null;
        try {
            if (user?.photoURL && user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STR)) {
                let imageRef = ref(storage, user?.photoURL);
                await deleteObject(imageRef).catch((error) => console.error(error));
            }

            if (imageUrl) {
                const data = await uploadString(storageRef, imageUrl, "data_url");
                newImageUrl = await getDownloadURL(data?.ref);
            }

            if (user) {
                await updateProfile(user, { displayName, photoURL: newImageUrl || "" })
                    .then(() => {
                        toast.success("업데이트 성공");
                        navigate("/profile");
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error("업데이트 실패");
                    });
            }
        } catch (error) {}
    };

    return (
        <div className="post">
            <PostHeader />
            <form onSubmit={onSubmit} className="post-form">
                <div className="post-form__profile">
                    <input
                        type="text"
                        name="displayName"
                        className="post-form__input"
                        placeholder="이름"
                        onChange={onChange}
                        value={displayName}
                    />
                    {imageUrl && (
                        <div className="post-form__attachment">
                            <img src={imageUrl} alt="profile_image" width={100} height={100} />
                            <button
                                type="button"
                                onClick={handleDeleteImage}
                                className="post-form__clear-btn"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
                <div className="post-form__submit-area">
                    <div className="post-form__image-area">
                        <label htmlFor="file-input" className="post-form__file">
                            <FiImage className="post-form__file_icon" />
                        </label>
                    </div>
                    <input
                        type="file"
                        name="file-input"
                        id="file-input"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <input type="submit" value="프로필 수정" className="post-form__submit-btn" />
                </div>
            </form>
        </div>
    );
}
