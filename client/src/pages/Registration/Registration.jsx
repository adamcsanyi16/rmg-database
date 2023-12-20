import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import config from "../../components/config";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [jelszoismetles, setJelszoismetles] = useState("");
  const authCode = "jYw2k9ByUNB";
  const [kod, setKod] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [auth, setAuth] = useState(false);

  const { dispatch } = useAuthContext();
  const url = config.URL;

  const navigate = useNavigate();

  const hitelesit = () => {
    if (kod === authCode) {
      setAuth(true);
      setError(null);
    } else {
      setError("Nem jó kódot adtál meg!");
    }
  };

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
      {!auth ? (
        <div>
          <h2>Kérd a regisztrációhoz szükséges kódot</h2>
          <div className="form-row">
            <input
              type="text"
              id="kod"
              name="kod"
              placeholder=""
              autoComplete="off"
              onChange={(e) => setKod(e.target.value)}
            />
          </div>
          <div className="authDiv">
            <button type="submit" onClick={hitelesit}>
              Tovább
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div>
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
              <Link to={"/belepes"}>Már van fiókod? Jelentkezz be!</Link>
              <button type="submit" disabled={isLoading}>
                Regisztráció
              </button>
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </form>
        </div>
      )}
    </div>
  );
};

export default Registration;
