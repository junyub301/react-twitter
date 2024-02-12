import { BsHouse } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { MdLogout, MdLogin } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import { getAuth, signOut } from "@firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";

export default function MenuList() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            const auth = getAuth(app);
            await signOut(auth);
            toast.success("로그아웃");
        } catch (error) {
            toast.error("로그아웃 실패");
        }
    };
    return (
        <div className="footer">
            <div className="footer__grid">
                <button
                    type="button"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <BsHouse />
                    Home
                </button>
                <button
                    type="button"
                    onClick={() => {
                        navigate("/profile");
                    }}
                >
                    <FaCircleUser />
                    Profile
                </button>
                <button
                    type="button"
                    onClick={() => {
                        navigate("/search");
                    }}
                >
                    <AiOutlineSearch />
                    Search
                </button>
                {user === null ? (
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <MdLogin />
                        Login
                    </button>
                ) : (
                    <button type="button" onClick={logOut}>
                        <MdLogout />
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}
