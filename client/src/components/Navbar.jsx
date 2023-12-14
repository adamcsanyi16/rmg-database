import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import config from "./config";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const url = config.URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + "/isAdmin", {
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

  const handleLinkClick = (linkId) => {
    setActiveLink(linkId);
  };

  return (
    <div className="navbar-container">
      <Link
        to={"/"}
        className={activeLink === "kezdolap" ? "logo active" : "logo"}
        onClick={() => handleLinkClick("kezdolap")}
      >
        Kezdőlap
      </Link>
      {user && (
        <div className="nav-links">
          <div className="login-links">
            <Link
              to={"/eredmenyekfelvetel"}
              id={activeLink === "eredmenyekfelvetel" ? "active" : ""}
              onClick={() => handleLinkClick("eredmenyekfelvetel")}
            >
              Eredeményfelvétel
            </Link>
            {isAdmin && (
              <Link
                to={"/versenyfelvetel"}
                id={activeLink === "versenyfelvetel" ? "active" : ""}
                onClick={() => handleLinkClick("versenyfelvetel")}
              >
                Verseny felvétel
              </Link>
            )}
            {isAdmin && (
              <Link
                to={"/agazatfelvetel"}
                id={activeLink === "agazatfelvetel" ? "active" : ""}
                onClick={() => handleLinkClick("agazatfelvetel")}
              >
                Ágazat felvétel
              </Link>
            )}
            {isAdmin && (
              <Link
                to={"/tanulofelvetel"}
                id={activeLink === "tanulofelvetel" ? "active" : ""}
                onClick={() => handleLinkClick("tanulofelvetel")}
              >
                Tanuló felvétel
              </Link>
            )}
            <Link
              to={"/eredmenyek"}
              id={activeLink === "eredmenyek" ? "active" : ""}
              onClick={() => handleLinkClick("eredmenyek")}
            >
              Eredmények
            </Link>
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
          <Link
            to={"/regisztracio"}
            id={activeLink === "regisztracio" ? "active" : ""}
            onClick={() => handleLinkClick("regisztracio")}
          >
            Regisztráció
          </Link>
          <Link
            to={"/belepes"}
            id={activeLink === "belepes" ? "active" : ""}
            onClick={() => handleLinkClick("belepes")}
          >
            Belépés
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
