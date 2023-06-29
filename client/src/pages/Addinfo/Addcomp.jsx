import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Select from "react-select";

function Addcomp() {
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
  const [dropdownOptions, setDropdownOptions] = useState([]);
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
      osztaly,
      tanarok,
    };

    const elkuld = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const adat = await fetch("http://localhost:3500/eredmeny", {
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

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const adat = await fetch("http://localhost:3500/verseny", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const response = await adat.json();

          const transformedOptions = response.comps.map((option) => ({
            label: option.verseny,
            value: option.verseny,
          }));
          setIsLoading(false);
          setDropdownOptions(transformedOptions);
          setNev(user.email);
        } else {
          const response = await adat.json();
          setIsLoading(false);
          setError(response.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownOptions();
  }, []);

  const handleDropdownChange = (selectedOption) => {
    setVerseny(selectedOption.value);
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

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "440px",
      fontSize: "14px",
      color: "#4d471bc9",
      border: "none",
      backgroundColor: "whitesmoke",
      padding: "0.5rem",
      borderRadius: "1rem",
      boxShadow: "0 0.4rem #b9ab444d",
      outlineColor: state.isFocused ? "#998d33c9" : null,
      borderColor: state.isFocused ? "#998d33c9" : null,
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(153, 141, 51, 0.3)"
        : "0 0.4rem #b9ab444d",
    }),
    menu: (provided) => ({
      ...provided,
      width: "440px",
      marginTop: "0",
      borderRadius: "1rem",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "1rem",
      color: "#4d471bc9",
      borderRadius: "1rem",
      backgroundColor: state.isFocused ? "#998d33c9" : null,
      color: state.isFocused ? "#fff" : "#4d471bc9",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4d471bc9",
    }),
  };

  return (
    <div className="form-container">
      <form onSubmit={feldolgoz} className="addcomp">
        <h2>Vedd fel az eredményt!</h2>
        <div className="form-row">
          <input
            type="text"
            placeholder="Felvevő neve"
            value={nev}
            className="input"
            onChange={(e) => setNev(e.target.value)}
          />
        </div>
        <p>Verseny típusa</p>
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
        <p>Verseny szintje</p>
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
          {dropdownOptions.length > 0 && (
            <Select
              placeholder="Verseny neve"
              options={dropdownOptions}
              onChange={handleDropdownChange}
              className="custom-select"
              styles={customSelectStyles}
            />
          )}
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
        <p>Verseny formája</p>
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
            placeholder="Elért helyezés"
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
