import { useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineLogout } from "react-icons/md";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import { useContext } from "react";
import AuthContext from "context/AuthContext";

export default function MenuList() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const onSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("로그아웃 되었습니다.");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.code);
    }
  };

  return (
    <div className="footer">
      <div className="footer__grid">
        <button className="menu__item" onClick={() => navigate("/")}>
          <GoHomeFill />
          Home
        </button>
        <button className="menu__item" onClick={() => navigate("/profile")}>
          <FaCircleUser />
          Profile
        </button>
        {user ? (
          <button className="menu__item" onClick={onSignOut}>
            <MdOutlineLogout />
            Logout
          </button>
        ) : (
          <button className="menu__item" onClick={() => navigate("/login")}>
            <FaCircleUser />
            Login
          </button>
        )}
      </div>
    </div>
  );
}
