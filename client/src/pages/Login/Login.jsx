import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import config from "../../components/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { dispatch } = useAuthContext();
  const url = config.URL;

  const navigate = useNavigate();

  const belep = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const adat = await fetch(url + "/belepes", {
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
    <div className="forms-container">
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
            type={showPass ? "text" : "password"}
            id="jelszo"
            name="jelszo"
            placeholder="Jelszó"
            onChange={(e) => setJelszo(e.target.value)}
          />
        </div>
        <div className="checkbox">
          <label className="container">
            <input
              type="checkbox"
              checked={showPass}
              onChange={(e) => setShowPass(e.target.checked)}
            />
            <div className="checkmark"></div>
          </label>
          <span>Mutasd a jelszót!</span>
        </div>
        <div className="forgot-password">
          <Link to={"/valtoztat"}>Elfejtettem a jelszavam</Link>
        </div>
        <div className="button-container">
          <Link to={"/regisztracio"}>Még nincs fiókod? Regisztrálj!</Link>
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
