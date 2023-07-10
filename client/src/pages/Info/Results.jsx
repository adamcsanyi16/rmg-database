import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Modal from "react-modal";
//import Select from "react-select";

const Results = () => {
  //VARIABLES
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [backToTop, setBackToTop] = useState(false);
  const [checkedBoxesVtipus, setCheckedBoxesVtipus] = useState([]);

  //FETCHING ISADMIN
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3500/isAdmin", {
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

  //LOADING DATA
  useEffect(() => {
    const data = async () => {
      if (!user) {
        setError("Nem vagy bejelentkezve!");
        return;
      }

      try {
        const adat = await fetch("http://localhost:3500/eredmeny", {
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
          setError(jsonData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    data();
  }, []);

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

      return searchBarSorting;
    });

    setFilteredResults(filtered);
  }, [searchTerm, results]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //BACKTOTOP USEEFFECT
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setBackToTop(true);
    } else {
      setBackToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        const toroltAdat = await fetch("http://localhost:3500/eredmeny", {
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
          console.log(jsonData);
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
    },
  };

  return (
    <div>
      <div className="sorting-container">
        {/*<label class="container">
          <input
            type="checkbox"
            checked={checkedBoxesVtipus.includes("tanulmányi")}
            onChange={() => handleCheckboxChange("tanulmányi")}
          />
          <div class="checkmark"></div>
          <p>Tanulmányi</p>
        </label>
        <label class="container">
          <input
            type="checkbox"
            checked={checkedBoxesVtipus.includes("sport")}
            onChange={() => handleCheckboxChange("sport")}
          />
          <div class="checkmark"></div>
          <p>Sport</p>
        </label>
        <label class="container">
          <input
            type="checkbox"
            checked={checkedBoxesVtipus.includes("művészeti")}
            onChange={() => handleCheckboxChange("művészeti")}
          />
          <div class="checkmark"></div>
          <p>Művészeti</p>
        </label>
        <label class="container">
          <input
            type="checkbox"
            checked={checkedBoxesVtipus.includes("országos")}
            onChange={() => handleCheckboxChange("országos")}
          />
          <div class="checkmark"></div>
          <p>Országos</p>
        </label>*/}
        <div className="filter">
          <input
            type="text"
            placeholder="Keresés..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="table-container">
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
    </div>
  );
};

export default Results;
