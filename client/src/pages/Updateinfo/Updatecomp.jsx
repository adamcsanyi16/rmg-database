import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

function Updatecomp() {
  const param = useParams();
  const [paramId, setParamid] = useState(param.id);
  const [nev, setNev] = useState("");
  const [vtipus, setVtipus] = useState("");
  const [vszint, setVszint] = useState("");
  const [verseny, setVerseny] = useState("");
  const [agazat, setAgazat] = useState("");
  const [vforma, setVforma] = useState("");
  const [helyezes, setHelyezes] = useState("");
  const [tanulok, setTanulok] = useState("");
  const [osztaly, setOsztaly] = useState("");
  const [tanarok, setTanarok] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const data = async () => {
      try {
        const adat = await fetch("http://localhost:3500/eredmeny", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const jsonData = await adat.json();
          console.log(jsonData);
          let competitionVal = jsonData.msg.filter(
            (elem) => elem._id === param.id
          );
          setNev(competitionVal[0].nev);
          setVtipus(competitionVal[0].vtipus);
          setVszint(competitionVal[0].vszint);
          setVerseny(competitionVal[0].verseny);
          setAgazat(competitionVal[0].agazat);
          setVforma(competitionVal[0].vforma);
          setHelyezes(competitionVal[0].helyezes);
          setTanulok(competitionVal[0].tanulok);
          setOsztaly(competitionVal[0].osztaly);
          setTanarok(competitionVal[0].tanarok);
        } else {
          const jsonData = await adat.json();
          console.log(jsonData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    data();
  }, [param.id, user.token]);

  const modosit = (event) => {
    event.preventDefault();

    if (!user) {
      setError("Nem vagy bejelentkezve!");
      return;
    }

    const adatok = {
      paramId,
      nev,
      vtipus,
      vszint,
      verseny,
      agazat,
      vforma,
      helyezes,
      tanulok,
      osztaly,
      tanarok,
    };

    const elkuld = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const adat = await fetch("http://localhost:3500/eredmeny", {
        method: "PUT",
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
    setOsztaly("");
    setTanarok("");
    setError(null);

    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={modosit} className="addcomp">
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
              checked={vtipus === "tanulmányi"}
              onChange={(e) => setVtipus(e.target.value)}
            />
            <span class="name">Tanulmányi</span>
          </label>
          <label class="radio">
            <input
              type="radio"
              name="vtipus"
              value="sport"
              checked={vtipus === "sport"}
              onChange={(e) => setVtipus(e.target.value)}
            />
            <span class="name">Sport</span>
          </label>

          <label class="radio">
            <input
              type="radio"
              name="vtipus"
              value="művészeti"
              checked={vtipus === "műveszeti"}
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
              checked={vszint === "nemzetközi"}
              onChange={(e) => setVszint(e.target.value)}
            />
            <span class="name">Nemzetközi</span>
          </label>
          <label class="radio">
            <input
              type="radio"
              name="vszint"
              value="országos"
              checked={vszint === "országos"}
              onChange={(e) => setVszint(e.target.value)}
            />
            <span class="name">Országos</span>
          </label>

          <label class="radio">
            <input
              type="radio"
              name="vszint"
              value="regionális/területi"
              checked={vszint === "regionális/területi"}
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
              checked={vforma === "egyéni"}
              onChange={(e) => setVforma(e.target.value)}
            />
            <span class="name">Egyéni</span>
          </label>
          <label class="radio">
            <input
              type="radio"
              name="vforma"
              value="csapat"
              checked={vforma === "csapat"}
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
            placeholder="Tanuló(k) osztálya"
            value={osztaly}
            className="input"
            onChange={(e) => setOsztaly(e.target.value)}
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
            Frissít
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

export default Updatecomp;
