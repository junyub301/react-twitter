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
import { IoMdNotificationsOutline } from "react-icons/io";
import useTranslation from "hooks/useTranslation";

export default function MenuList() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const t = useTranslation();
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
                    <span className="footer__grid--text">{t("MENU_HOME")}</span>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        navigate("/profile");
                    }}
                >
                    <FaCircleUser />
                    <span className="footer__grid--text">{t("MENU_PROFILE")}</span>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        navigate("/search");
                    }}
                >
                    <AiOutlineSearch />
                    <span className="footer__grid--text">{t("MENU_SEARCH")}</span>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        navigate("/notifications");
                    }}
                >
                    <IoMdNotificationsOutline />
                    <span className="footer__grid--text">{t("MENU_NOTI")}</span>
                </button>
                {user === null ? (
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <MdLogin />
                        {t("MENU_LOGIN")}
                    </button>
                ) : (
                    <button type="button" onClick={logOut}>
                        <MdLogout />
                        <span className="footer__grid--text">{t("MENU_LOGOUT")}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
