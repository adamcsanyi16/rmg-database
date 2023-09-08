import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [jelszoismetles, setJelszoismetles] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const url = "https://radnoti.adaptable.app/";

  const navigate = useNavigate();

  const register = async () => {
    setIsLoading(true);
    setError(null);

    const adat = await fetch(url + "/regisztral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, jelszo, jelszoismetles }),
    });

    if (!adat.ok) {
      const response = await adat.json();
      setIsLoading(false);
      setError(response.msg);
    } else {
      const response = await adat.json();
      setSuccess(response.msg);

      localStorage.setItem("user", JSON.stringify(response));
      dispatch({ type: "LOGIN", payload: response });

      setIsLoading(false);
      navigate("/eredmenyek");
    }
  };

  const regisztral = async (event) => {
    event.preventDefault();
    await register();
  };

  return (
    <div className="forms-container">
      <form onSubmit={regisztral}>
        <h2>Regisztráció</h2>
        <div className="form-row">
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email-cím"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="password"
            id="jelszo"
            name="jelszo"
            placeholder="Jelszó"
            onChange={(e) => setJelszo(e.target.value)}
          />
        </div>

        <div className="form-row">
          <input
            type="password"
            id="jelszoismetles"
            name="jelszoismetles"
            placeholder="Jelszó ismét"
            onChange={(e) => setJelszoismetles(e.target.value)}
          />
        </div>
        <div className="button-container">
          <Link to={"/login"}>Már van fiókod? Jelentkezz be!</Link>
          <button type="submit" disabled={isLoading}>
            Regisztráció
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default Registration;
