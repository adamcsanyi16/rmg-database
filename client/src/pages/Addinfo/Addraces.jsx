import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Addraces = () => {
  const [verseny, setVerseny] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  const feldolgoz = (event) => {
    event.preventDefault();

    if (!user) {
      setError("Nem vagy bejelentkzve!");
      return;
    }

    const adatok = {
      verseny,
    };

    const elkuld = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const adat = await fetch("http://localhost:3500/verseny", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(adatok),
      });

      if (adat.ok) {
        const response = await adat.json();
        setIsLoading(false);
        setSuccess(response.msg);
      } else {
        const response = await adat.json();
        setIsLoading(false);
        setError(response.msg);
      }
    };

    elkuld();
  };

  const torles = async (e) => {
    e.preventDefault();
    setVerseny("");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="form-container">
      <form onSubmit={feldolgoz} className="addcomp">
        <h2>Vedd fel a versenyt!</h2>
        <div className="form-row">
          <input
            type="text"
            placeholder="Verseny"
            value={verseny}
            className="input"
            onChange={(e) => setVerseny(e.target.value)}
          />
        </div>
        <div className="button-row">
          <button disabled={isLoading} type="submit">
            Felvesz
          </button>
          <button disabled={isLoading} onClick={torles}>
            Törlés
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default Addraces;
