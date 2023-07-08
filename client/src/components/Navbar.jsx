import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3500/isAdmin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const isAdmin = data.isAdmin;
          setIsAdmin(isAdmin);
        } else {
          console.log("Error:", response.status);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user]);

  const klikk = () => {
    logout();
  };

  return (
    <div className="navbar-container">
        <Link to={"/"} className="logo">
          Kezdőlap
        </Link>
        {user && (
          <div className="nav-links">
            <div className="login-links">
              <Link to={"/eredmenyekfelvetel"}>Eredeményfelvétel</Link>
              {isAdmin && <Link to={"/versenyfelvetel"}>Versenyfelvétel</Link>}
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
    </div>
  );
};

export default Navbar;
