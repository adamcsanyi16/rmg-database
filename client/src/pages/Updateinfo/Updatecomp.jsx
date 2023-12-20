import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import config from "../../components/config";

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

  const [tanulokSplit, setTanulokSplit] = useState("");

  const [dropdownTanulok, setDropdownTanulok] = useState([]);
  const [dropdownVersenyek, setDropdownVersenyek] = useState([]);
  const [dropdownAgazatok, setDropdownAgazatok] = useState([]);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthContext();
  const url = config.URL;

  useEffect(() => {
    const data = async () => {
      try {
        const adat = await fetch(url + "/eredmeny", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const jsonData = await adat.json();
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
          const splitTanulok = competitionVal[0].tanulok
            .split(",")
            .map((tanulo) => tanulo);
          console.log(splitTanulok);
          setTanulokSplit(splitTanulok);
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

  //FETCHING TANULOK
  useEffect(() => {
    const fetchDropdownTanulok = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const adat = await fetch(url + "/student", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const response = await adat.json();

          const transformedOptions = response.student.map((option) => ({
            label: option.nev,
            value: option.nev,
          }));
          setIsLoading(false);
          setDropdownTanulok(transformedOptions);
        } else {
          const response = await adat.json();
          setIsLoading(false);
          setError(response.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownTanulok();
  }, [user, url]);

  //FETCHING VERSENYEK
  useEffect(() => {
    const fetchDropdownVersenyek = async () => {
      try {
        const adat = await fetch(url + "/verseny", {
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
          setDropdownVersenyek(transformedOptions);
        } else {
          const response = await adat.json();
          setIsLoading(false);
          setError(response.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownVersenyek();
  }, [user, url]);

  //FETCHING AGAZATOK
  useEffect(() => {
    const fetchDropdownAgazatok = async () => {
      try {
        const adat = await fetch(url + "/agazat", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const response = await adat.json();
          const transformedOptions = response.agazat.map((option) => ({
            label: option.agazat,
            value: option.agazat,
          }));
          setDropdownAgazatok(transformedOptions);
        } else {
          const response = await adat.json();
          setError(response.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownAgazatok();
  }, [user.token, url]);

  const handleVersenyChange = (selectedOption) => {
    setVerseny(selectedOption.value);
  };

  const handleTanuloChange = (selectedOption) => {
    const data = selectedOption.map((option) => option.label).join(", ");
    setTanulok(data);
    const dataSplit = selectedOption.map((option) => option.label);
    setTanulokSplit(dataSplit);
  };

  const handleAgazatChange = (selectedOption) => {
    setAgazat(selectedOption.value);
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
      borderRadius: "1rem",
      backgroundColor: state.isFocused ? "#998d33c9" : null,
      color: state.isFocused ? "#fff" : "#4d471bc9",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4d471bc9",
      boxShadow: "none",
    }),
  };

  const animatedComponents = makeAnimated();

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

      const adat = await fetch(url + "/eredmeny", {
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
      <div className="updateContainer">
        {!isLoading ? <div></div> : <div className="loader"></div>}
        <form onSubmit={modosit} className="addcomp" id="addcomp">
          <div className="form-row">
            <input
              type="text"
              placeholder="Név"
              value={nev}
              readOnly
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
            {dropdownVersenyek.length > 0 && (
              <Select
                placeholder="Verseny neve"
                options={dropdownVersenyek}
                value={{ label: verseny, value: verseny }}
                onChange={handleVersenyChange}
                className="custom-select"
                styles={customSelectStyles}
              />
            )}
          </div>
          <div className="form-row">
            {dropdownAgazatok.length > 0 && (
              <Select
                placeholder="Ágazatok"
                value={{ label: agazat, value: agazat }}
                options={dropdownAgazatok}
                onChange={handleAgazatChange}
                className="custom-select"
                styles={customSelectStyles}
              />
            )}
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
            {dropdownTanulok.length > 0 && (
              <Select
                placeholder="Tanuló(k)"
                value={tanulokSplit.map((t) => ({ label: t, value: t }))}
                options={dropdownTanulok}
                onChange={handleTanuloChange}
                className="custom-select"
                isMulti
                components={animatedComponents}
                styles={customSelectStyles}
              />
            )}
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
    </div>
  );
}

export default Updatecomp;
