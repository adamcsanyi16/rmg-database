import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const belep = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const adat = await fetch("http://localhost:3500/belepes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, jelszo }),
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

  const belepes = async (event) => {
    event.preventDefault();
    await belep();
  };

  return (
    <div className="form-container">
      <form onSubmit={belepes}>
        <h2>Belépés</h2>
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
        <div className="button-container">
          <Link to={"/register"}>Még nincs fiókod? Regisztrálj!</Link>
          <button type="submit" disabled={isLoading}>
            Belépés
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default Login;