import {
    GithubAuthProvider,
    GoogleAuthProvider,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "@firebase/auth";
import { app } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const t = useTranslation();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            currentTarget: { name, value },
        } = e;

        if (name === "email") {
            setEmail(value);
            const validRegex =
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!value.match(validRegex)) {
                setError("이메일 형식이 올바르지 않습니다.");
            } else {
                setError("");
            }
        }
        if (name === "password") {
            setPassword(value);
            if (value.length < 8) {
                setError("비밀번호는 8자리 이상 입력해주세요.");
            } else {
                setError("");
            }
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const auth = getAuth(app);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
            toast.success("로그인 성공");
        } catch (error) {
            toast.error("로그인 실패");
        }
    };
    const onClickSocialLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget: { name },
        } = e;

        let provider;
        const auth = getAuth(app);

        if (name === "google") {
            provider = new GoogleAuthProvider();
        }

        if (name === "github") {
            provider = new GithubAuthProvider();
        }

        await signInWithPopup(auth, provider as GithubAuthProvider | GoogleAuthProvider)
            .then((res) => {
                toast.success("로그인 성공");
            })
            .catch((error) => {
                console.error(error);
                const errorMessage = error?.message;
                toast.error(errorMessage);
            });
    };

    return (
        <form className="form form--lg" onSubmit={onSubmit}>
            <div className="form__title">{t("MENU_LOGIN")}</div>
            <div className="form__block">
                <label htmlFor="email">{t("FORM_EMAIL")}</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    required
                    onChange={onChange}
                />
            </div>
            <div className="form__block">
                <label htmlFor="password">{t("FORM_PASSWORD")}</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    required
                    onChange={onChange}
                />
            </div>

            {error && (
                <div className="form__block">
                    <div className="form__error"></div>
                </div>
            )}
            <div className="form__block">
                {t("NO_ACCOUNT")}
                <Link to="/users/signup" className="form__link">
                    {t("SIGNUP_LINK")}
                </Link>
            </div>
            <div className="form__block">
                <button className="form__btn-submit" type="submit" disabled={error.length > 0}>
                    {t("SIGNUP_LINK")}
                </button>
            </div>
            <div className="form__block">
                <button
                    className="form__btn-google"
                    type="button"
                    name="google"
                    onClick={onClickSocialLogin}
                >
                    {t("LOGIN_WITH_GOOGLE")}
                </button>
            </div>
            <div className="form__block">
                <button
                    className="form__btn-github"
                    type="button"
                    name="github"
                    onClick={onClickSocialLogin}
                >
                    {t("LOGIN_WITH_GITHUB")}
                </button>
            </div>
        </form>
    );
}
