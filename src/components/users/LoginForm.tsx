import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { app } from "firebaseApp";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            currentTarget: { name, value },
        } = e;
        console.log("🚀 ~ onChange ~ value:", value);
        console.log("🚀 ~ onChange ~ name:", name);

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

    return (
        <form className="form form--lg" onSubmit={onSubmit}>
            <div className="form__title">회원가입</div>
            <div className="form__block">
                <label htmlFor="email">이메일</label>
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
                <label htmlFor="password">비밀번호</label>
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
                계정이 없으신가요?
                <Link to="/users/signup" className="form__link">
                    회원가입 하기
                </Link>
            </div>
            <div className="form__block">
                <button className="form__btn-submit" type="submit" disabled={error.length > 0}>
                    로그인
                </button>
            </div>
        </form>
    );
}
