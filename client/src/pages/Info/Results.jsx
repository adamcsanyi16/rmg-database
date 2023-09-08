import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import Modal from "react-modal";
import Select from "react-select";

const Results = () => {
  const { logout } = useLogout();
  const url = "https://radnoti.adaptable.app/";

  //VARIABLES
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showTokenExpiredModal, setShowTokenExpiredModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [backToTop, setBackToTop] = useState(false);
  const [dropdownVersenyek, setDropdownVersenyek] = useState([]);
  const [selectedVerseny, setSelectedVerseny] = useState(null);
  const [dropdownAgazatok, setDropdownAgazatok] = useState([]);
  const [selectedAgazat, setSelectedAgazat] = useState(null);

  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [isTanulmanyiChecked, setIsTanulmanyiChecked] = useState(false);
  const [isSportChecked, setIsSportChecked] = useState(false);
  const [isMuveszetiChecked, setIsMuveszetiChecked] = useState(false);
  const [isRegionalisChecked, setIsRegionalisChecked] = useState(false);
  const [isOrszagosChecked, setIsOrszagosChecked] = useState(false);
  const [isNemzetkoziChecked, setIsNemzetkoziChecked] = useState(false);
  const [isEgyeniChecked, setIsEgyeniChecked] = useState(false);
  const [isCsapatChecked, setIsCsapatChecked] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  //WINDOW WIDTH LISTENER
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //SHOW/HIDE FILTERS
  const handleCheckboxChange = (e) => {
    setShowFilters(e.target.checked);
  };

  //FETCHING ISADMIN
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
        } else {
          console.log("Error:", response.status);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user]);

  //FETCHING COMPETITIONS
  useEffect(() => {
    const fetchDropdownOptions = async () => {
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
          setDropdownVersenyek(transformedOptions);
        } else {
          const response = await adat.json();
          setError(response.msg);
          if (response.msg.includes("Token expired")) {
            setShowTokenExpiredModal(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownOptions();
  }, [user.token]);

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
  }, [user.token]);

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      width: screenWidth <= 1300 ? "170px" : "200px",
      fontSize: "11px",
      color: "#4d471bc9",
      border: "none",
      backgroundColor: "whitesmoke",
      padding: "0.5rem",
      borderRadius: "1rem",
      outlineColor: state.isFocused ? "#998d33c9" : null,
      borderColor: state.isFocused ? "#998d33c9" : null,
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(153, 141, 51, 0.3)"
        : "0 0.4rem #b9ab444d",
    }),
    menu: (provided) => ({
      ...provided,
      width: screenWidth <= 1300 ? "170px" : "200px",
      marginTop: "0",
      borderRadius: "1rem",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "1rem",
      borderRadius: "1rem",
      fontSize: "11px",
      backgroundColor: state.isFocused ? "#998d33c9" : null,
      color: state.isFocused ? "#fff" : "#4d471bc9",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4d471bc9",
    }),
  };

  const handleDropdownChange = (selectedVerseny) => {
    setSelectedVerseny(selectedVerseny);
  };

  const handleAgazatChange = (selectedAgazat) => {
    setSelectedAgazat(selectedAgazat);
  };

  const handleResetVerseny = () => {
    setSelectedVerseny(null);
  };

  const handleResetAgazat = () => {
    setSelectedAgazat(null);
  };

  const handleResetAll = () => {
    setIsTanulmanyiChecked(false);
    setIsSportChecked(false);
    setIsMuveszetiChecked(false);
    setIsRegionalisChecked(false);
    setIsOrszagosChecked(false);
    setIsNemzetkoziChecked(false);
    setSelectedVerseny(null);
    setSelectedAgazat(null);
    setIsEgyeniChecked(false);
    setIsCsapatChecked(false);
    setFromValue("");
    setToValue("");
  };

  //LOADING DATA
  useEffect(() => {
    const data = async () => {
      if (!user) {
        setError("Nem vagy bejelentkezve!");
        return;
      }

      try {
        const adat = await fetch(url + "/eredmeny", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const jsonData = await adat.json();
          setResults(jsonData.msg);
        } else {
          const jsonData = await adat.json();
          setError(jsonData.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };

    data();
  }, [user]);

  //SEARCHING
  useEffect(() => {
    const filtered = results.filter((result) => {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const lowercaseNev = result.nev.toLowerCase();
      const lowercaseVtipus = result.vtipus.toLowerCase();
      const lowercaseVszint = result.vszint.toLowerCase();
      const lowercaseVerseny = result.verseny.toLowerCase();
      const lowercaseAgazat = result.agazat.toLowerCase();
      const lowercaseVforma = result.vforma.toLowerCase();
      const lowercaseHelyezes = result.helyezes.toLowerCase();
      const lowercaseTaulok = result.tanulok.toLowerCase();
      const lowercaseOsztaly = result.osztaly.toLowerCase();
      const lowercaseTanarok = result.tanarok.toLowerCase();

      const searchBarSorting =
        lowercaseNev.includes(lowercaseSearchTerm) ||
        lowercaseVtipus.includes(lowercaseSearchTerm) ||
        lowercaseVszint.includes(lowercaseSearchTerm) ||
        lowercaseVerseny.includes(lowercaseSearchTerm) ||
        lowercaseAgazat.includes(lowercaseSearchTerm) ||
        lowercaseVforma.includes(lowercaseSearchTerm) ||
        lowercaseHelyezes.includes(lowercaseSearchTerm) ||
        lowercaseTaulok.includes(lowercaseSearchTerm) ||
        lowercaseOsztaly.includes(lowercaseSearchTerm) ||
        lowercaseTanarok.includes(lowercaseSearchTerm);

      const isFromValueValid =
        fromValue === "" || parseInt(result.helyezes) >= parseInt(fromValue);
      const isToValueValid =
        toValue === "" || parseInt(result.helyezes) <= parseInt(toValue);

      const isVtipusValid =
        (!isTanulmanyiChecked ||
          result.vtipus.toLowerCase() === "tanulmányi") &&
        (!isSportChecked || result.vtipus.toLowerCase() === "sport") &&
        (!isMuveszetiChecked || result.vtipus.toLowerCase() === "művészeti");

      const isVszintValid =
        (!isRegionalisChecked ||
          result.vszint.toLowerCase() === "regionális/területi") &&
        (!isOrszagosChecked || result.vszint.toLowerCase() === "országos") &&
        (!isNemzetkoziChecked || result.vszint.toLowerCase() === "nemzetközi");

      const isVformaValid =
        (!isEgyeniChecked || result.vforma.toLowerCase() === "egyéni") &&
        (!isCsapatChecked || result.vforma.toLowerCase() === "csapat");

      const isVersenyValid =
        selectedVerseny === null ||
        result.verseny.toLowerCase() === selectedVerseny.value.toLowerCase();

      const isAgazatValid =
        selectedAgazat === null ||
        result.agazat.toLowerCase() === selectedAgazat.value.toLowerCase();

      return (
        searchBarSorting &&
        isFromValueValid &&
        isToValueValid &&
        isVtipusValid &&
        isVszintValid &&
        isVformaValid &&
        isVersenyValid &&
        isAgazatValid
      );
    });

    setFilteredResults(filtered);
  }, [
    searchTerm,
    results,
    fromValue,
    toValue,
    isTanulmanyiChecked,
    isSportChecked,
    isMuveszetiChecked,
    isRegionalisChecked,
    isOrszagosChecked,
    isNemzetkoziChecked,
    isEgyeniChecked,
    isCsapatChecked,
    selectedVerseny,
    selectedAgazat,
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //HELYEZES FILTER RESET
  const handleHelyezesReset = () => {
    setFromValue("");
    setToValue("");
  };

  //BACKTOTOP USEEFFECT
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const tableContainer = tableContainerRef.current;

    const handleScroll = () => {
      if (tableContainer.scrollTop > 100) {
        setBackToTop(true);
      } else {
        setBackToTop(false);
      }
    };

    tableContainer.addEventListener("scroll", handleScroll);
    return () => {
      tableContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const tableContainer = tableContainerRef.current;
    tableContainer.scrollTo({ top: 0, behavior: "smooth" });
  };

  //PAGES OF RESULTS
  const resultsPerPage = 25;
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  //DELETING
  const torol = (item) => {
    const { _id: id } = item;
    const adatTorol = async () => {
      try {
        const toroltAdat = await fetch(url + "/eredmeny", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ id }),
        });

        if (toroltAdat.ok) {
          const modositottAdat = results.filter((item) => item._id !== id);
          setResults(modositottAdat);
          const jsonData = await toroltAdat.json();
          setSuccess(jsonData.msg);
        } else {
          const jsonData = await toroltAdat.json();
          setError(jsonData.msg);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    adatTorol();
    closeModal();
  };

  //POPUP DELETE
  const openModal = (item) => {
    setShowModal(true);
    setItemToDelete(item);
  };

  const closeModal = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const deleteId = (id) => {
    const item = results.find((result) => result._id === id);
    openModal(item);
  };

  //POPUP STYLING
  const modalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 9999,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "400px",
      maxHeight: "400px",
      margin: "auto",
      padding: "20px",
      backgroundColor: "fff",
      borderRadius: "2rem",
    },
  };

  const closeModalTokenExpired = () => {
    logout();
    setShowTokenExpiredModal(false);
  };

  return (
    <div className="results">
      <div className="results-wrap">
        <div className={`sorting-container ${!showFilters && "smaller-width"}`}>
          <div className="menu-btn">
            <label className="burger" htmlFor="burger">
              <input
                type="checkbox"
                id="burger"
                checked={showFilters}
                onChange={handleCheckboxChange}
              />
              <span></span>
              <span></span>
              <span></span>
            </label>
          </div>
          {showFilters && (
            <div className="all-filter">
              <div className="filter">
                <input
                  type="text"
                  placeholder="Keresés..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <span id="reset-btn" onClick={handleResetAll}>
                Alapértelmezett
              </span>
              <div className="vtipus">
                <span id="category">Versenytípus</span>
                <div className="checkbox">
                  <label className="container">
                    <input
                      type="checkbox"
                      checked={isTanulmanyiChecked}
                      onChange={(e) => setIsTanulmanyiChecked(e.target.checked)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <span>Tanulmányi</span>
                </div>
                <div className="checkbox">
                  <label className="container">
                    <input
                      type="checkbox"
                      checked={isSportChecked}
                      onChange={(e) => setIsSportChecked(e.target.checked)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <span>Sport</span>
                </div>
                <div className="checkbox">
                  <label className="container">
                    <input
                      type="checkbox"
                      checked={isMuveszetiChecked}
                      onChange={(e) => setIsMuveszetiChecked(e.target.checked)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <span>Művészeti</span>
                </div>
              </div>
              <div className="vszint">
                <span id="category">Versenyszint</span>
                <div className="checkbox">
                  <label className="container">
                    <input
                      type="checkbox"
                      checked={isRegionalisChecked}
                      onChange={(e) => setIsRegionalisChecked(e.target.checked)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <span>Regionális/területi</span>
                </div>
                <div className="checkbox">
                  <label className="container">
                    <input
                      type="checkbox"
                      checked={isOrszagosChecked}
                      onChange={(e) => setIsOrszagosChecked(e.target.checked)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <span>Országos</span>
                </div>
                <div className="checkbox">
                  <label className="container">
                    <input
                      type="checkbox"
                      checked={isNemzetkoziChecked}
                      onChange={(e) => setIsNemzetkoziChecked(e.target.checked)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <span>Nemzetközi</span>
                </div>
              </div>
              <div className="versenyek">
                <span id="category">Versenyek</span>
                {dropdownVersenyek.length > 0 && (
                  <Select
                    options={dropdownVersenyek}
                    placeholder=""
                    value={selectedVerseny}
                    onChange={handleDropdownChange}
                    className="custom-select"
                    styles={customSelectStyles}
                  />
                )}
                <button onClick={handleResetVerseny}>Visszaállít</button>
              </div>
              <div className="agazatok">
                <span id="category">Ágazatok</span>
                {dropdownAgazatok.length > 0 && (
                  <Select
                    options={dropdownAgazatok}
                    placeholder=""
                    value={selectedAgazat}
                    onChange={handleAgazatChange}
                    className="custom-select"
                    styles={customSelectStyles}
                  />
                )}
                <button onClick={handleResetAgazat}>Visszaállít</button>
              </div>
              <div className="vforma">
                <span id="category">Versenyforma</span>
                <div className="checkbox">
                  <label className="container">
                    <input
                      type="checkbox"
                      checked={isEgyeniChecked}
                      onChange={(e) => setIsEgyeniChecked(e.target.checked)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <span>Egyéni</span>
                </div>
                <div className="checkbox">
                  <label className="container">
                    <input
                      type="checkbox"
                      checked={isCsapatChecked}
                      onChange={(e) => setIsCsapatChecked(e.target.checked)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <span>Csapat</span>
                </div>
              </div>
              <div className="helyezes">
                <span id="category">Helyezés</span>
                <div className="from-to">
                  <input
                    type="number"
                    placeholder="Tól"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                  />
                </div>
                <div className="from-to">
                  <input
                    type="number"
                    placeholder="Ig"
                    value={toValue}
                    onChange={(e) => setToValue(e.target.value)}
                  />
                </div>
                <button onClick={handleHelyezesReset}>Visszaállít</button>
              </div>
            </div>
          )}
        </div>
        <div className="table-container" ref={tableContainerRef}>
          {success && <div className="success">{success}</div>}
          {error && <div className="error">{error}</div>}
          <div className="allinfo">
            <div className="table">
              <table className="styled-table">
                <thead>
                  <tr>
                    {isAdmin && <th>Felvevő email</th>}
                    <th>Verseny típusa</th>
                    <th>Verseny szintje</th>
                    <th>Verseny neve</th>
                    <th>Ágazat</th>
                    <th>Verseny formája</th>
                    <th>Helyezés</th>
                    <th>Tanulók</th>
                    <th>Osztály</th>
                    <th>Felkészítő tanár(ok)</th>
                    {isAdmin && <th></th>}
                    {isAdmin && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {currentResults.map((result) => (
                    <tr key={result._id}>
                      {isAdmin && <td>{result.nev}</td>}
                      <td>{result.vtipus}</td>
                      <td>{result.vszint}</td>
                      <td>{result.verseny}</td>
                      <td>{result.agazat}</td>
                      <td>{result.vforma}</td>
                      <td>{result.helyezes}</td>
                      <td>{result.tanulok}</td>
                      <td>{result.osztaly}</td>
                      <td>{result.tanarok}</td>
                      {isAdmin && (
                        <td>
                          <Link to={"/eredmenyek/" + result._id}>
                            <button className="btn">
                              <svg
                                className="icon"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                fill="none"
                                height="24"
                                width="24"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                              </svg>
                            </button>
                          </Link>
                        </td>
                      )}
                      {isAdmin && (
                        <td>
                          <button
                            className="btn"
                            onClick={() => deleteId(result._id)}
                          >
                            <svg
                              viewBox="0 0 15 17.5"
                              height="24"
                              width="24"
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon"
                            >
                              <path
                                transform="translate(-2.5 -1.25)"
                                d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                                id="Fill"
                              ></path>
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Oldal: {currentPage}</p>
              <div className="toggle-buttons">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    disabled={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Modal
            isOpen={showModal}
            onRequestClose={closeModal}
            contentLabel="Megerősítés"
            style={modalStyles}
          >
            <h2>Biztos hogy törlöd az adatot?</h2>
            <div className="modal-buttons">
              <button onClick={() => torol(itemToDelete)}>Törlés</button>
              <button onClick={closeModal}>Mégsem</button>
            </div>
          </Modal>
        </div>
      </div>
      <button
        className={`back-to-top ${backToTop ? "show" : ""}`}
        onClick={scrollToTop}
      >
        <svg
          height="1.2em"
          width="1.2rem"
          className="icon"
          viewBox="0 0 512 512"
        >
          <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path>
        </svg>
      </button>
      <Modal
        isOpen={showTokenExpiredModal}
        onRequestClose={closeModalTokenExpired}
        contentLabel="Token expired"
        style={modalStyles}
      >
        <h2>Jelentkezz be újra!</h2>
        <div className="modal-buttons">
          <button onClick={closeModalTokenExpired}>OK</button>
        </div>
      </Modal>
    </div>
  );
};

export default Results;
