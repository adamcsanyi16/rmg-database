import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

function Addcomp() {
  const [nev, setNev] = useState("");
  const [vtipus, setVtipus] = useState("");
  const [vszint, setVszint] = useState("");
  const [verseny, setVerseny] = useState("");
  const [agazat, setAgazat] = useState("");
  const [vforma, setVforma] = useState("");
  const [helyezes, setHelyezes] = useState("");
  const [tanulok, setTanulok] = useState("");
  const [tanarok, setTanarok] = useState("");
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
      nev,
      vtipus,
      vszint,
      verseny,
      agazat,
      vforma,
      helyezes,
      tanulok,
      tanarok,
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
    setHelyezes("");
    setTanulok("");
  };

  const torles = async (e) => {
    e.preventDefault();
    setNev("");
    setVtipus("");
    setVszint("");
    setVerseny("");
    setAgazat("");
    setVforma("");
    setHelyezes("");
    setTanulok("");
    setTanarok("");
    setError(null);

    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={feldolgoz} className="addcomp">
        <div className="form-row">
          <input
            type="text"
            placeholder="Név"
            value={nev}
            className="input"
            onChange={(e) => setNev(e.target.value)}
          />
        </div>
        <div class="radio-inputs">
          <label class="radio">
            <input
              type="radio"
              name="vtipus"
              value="tanulmányi"
              onChange={(e) => setVtipus(e.target.value)}
            />
            <span class="name">Tanulmányi</span>
          </label>
          <label class="radio">
            <input
              type="radio"
              name="vtipus"
              value="sport"
              onChange={(e) => setVtipus(e.target.value)}
            />
            <span class="name">Sport</span>
          </label>

          <label class="radio">
            <input
              type="radio"
              name="vtipus"
              value="művészeti"
              onChange={(e) => setVtipus(e.target.value)}
            />
            <span class="name">Művészeti</span>
          </label>
        </div>
        <div class="radio-inputs">
          <label class="radio">
            <input
              type="radio"
              name="vszint"
              value="nemzetközi"
              onChange={(e) => setVszint(e.target.value)}
            />
            <span class="name">Nemzetközi</span>
          </label>
          <label class="radio">
            <input
              type="radio"
              name="vszint"
              value="országos"
              onChange={(e) => setVszint(e.target.value)}
            />
            <span class="name">Országos</span>
          </label>

          <label class="radio">
            <input
              type="radio"
              name="vszint"
              value="regionális/területi"
              onChange={(e) => setVszint(e.target.value)}
            />
            <span class="name">Regionális/területi</span>
          </label>
        </div>

        <div className="form-row">
          <input
            type="text"
            placeholder="Verseny neve"
            value={verseny}
            className="input"
            onChange={(e) => setVerseny(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Ágazat"
            value={agazat}
            className="input"
            onChange={(e) => setAgazat(e.target.value)}
          />
        </div>
        <div class="radio-inputs">
          <label class="radio">
            <input
              type="radio"
              name="vforma"
              value="egyéni"
              onChange={(e) => setVforma(e.target.value)}
            />
            <span class="name">Egyéni</span>
          </label>
          <label class="radio">
            <input
              type="radio"
              name="vforma"
              value="csapat"
              onChange={(e) => setVforma(e.target.value)}
            />
            <span class="name">Csapat</span>
          </label>
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Helyezés"
            value={helyezes}
            className="input"
            onChange={(e) => setHelyezes(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Résztvevő tanuló(k) neve"
            value={tanulok}
            className="input"
            onChange={(e) => setTanulok(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Felkészítő tanár(ok) neve(i)"
            className="input"
            value={tanarok}
            onChange={(e) => setTanarok(e.target.value)}
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
}

export default Addcomp;
