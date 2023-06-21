import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Modal from "react-modal";

const Results = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const data = async () => {
      if (!user) {
        setError("Nem vagy bejelentkezve!");
        return;
      }

      try {
        const adat = await fetch("http://localhost:3500/verseny", {
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

  useEffect(() => {
    const filtered = results.filter((result) => {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const lowercaseNev = result.nev.toLowerCase();
      const lowercaseVtipus = result.vtipus.toLowerCase();
      const lowercaseVszint = result.vszint.toLowerCase();
      const lowercaseVerseny = result.verseny.toLowerCase();
      const lowercaseAgazat = result.agazat.toLowerCase();
      const lowercaseHelyezes = result.helyezes.toLowerCase();
      const lowercaseTaulok = result.tanulok.toLowerCase();
      const lowercaseTanarok = result.tanarok.toLowerCase();

      return (
        lowercaseNev.includes(lowercaseSearchTerm) ||
        lowercaseVtipus.includes(lowercaseSearchTerm) ||
        lowercaseVszint.includes(lowercaseSearchTerm) ||
        lowercaseVerseny.includes(lowercaseSearchTerm) ||
        lowercaseAgazat.includes(lowercaseSearchTerm) ||
        lowercaseHelyezes.includes(lowercaseSearchTerm) ||
        lowercaseTaulok.includes(lowercaseSearchTerm) ||
        lowercaseTanarok.includes(lowercaseSearchTerm)
      );
    });

    setFilteredResults(filtered);
  }, [searchTerm, results]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const torol = (item) => {
    const { _id: id } = item;
    const adatTorol = async () => {
      try {
        const toroltAdat = await fetch("http://localhost:3500/verseny", {
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
    <div className="table-container">
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
      <div className="filter">
        <input
          type="text"
          placeholder="Keresés..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="allinfo">
        <div className="table">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Név</th>
                <th>Verseny típusa</th>
                <th>Verseny szintje</th>
                <th>Verseny neve</th>
                <th>Ágazat</th>
                <th>Verseny formája</th>
                <th>Helyezés</th>
                <th>Tanulók</th>
                <th>Felkészítő tanár(ok)</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result._id}>
                  <td>{result.nev}</td>
                  <td>{result.vtipus}</td>
                  <td>{result.vszint}</td>
                  <td>{result.verseny}</td>
                  <td>{result.agazat}</td>
                  <td>{result.vforma}</td>
                  <td>{result.helyezes}</td>
                  <td>{result.tanulok}</td>
                  <td>{result.tanarok}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
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
  );
};

export default Results;
