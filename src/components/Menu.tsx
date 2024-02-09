import { BsHouse } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";

export default function MenuList() {
    const navigate = useNavigate();
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
                        navigate("/");
                    }}
                >
                    <MdLogout />
                    Logout
                </button>
            </div>
        </div>
    );
}
