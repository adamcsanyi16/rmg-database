import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const klikk = () => {
    logout();
  };

  return (
    <div className="navbar-container">
      <nav>
        <Link to={"/"} className="logo">
          Kezdőlap
        </Link>
        {user && (
          <div className="nav-links">
            <div className="login-links">
                <Link to={"/versenyfelvetel"}>Versenyfelvétel</Link>
              <Link to={"/eredmenyek"}>Eredmények</Link>
            </div>
            <div className="userinfo">
              <span>{user.email}</span>
              <button className="logout-btn" onClick={klikk}>
                Kilépés
              </button>
            </div>
          </div>
        )}
        {!user && (
          <div className="nav-links">
            <Link to={"/register"}>Regisztráció</Link>
            <Link to={"/login"}>Belépés</Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
