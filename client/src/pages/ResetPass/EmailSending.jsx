import { useState, useContext } from "react";
import { RecoveryContext } from "./Reset";
import axios from "axios";

const EmailSending = () => {
  const { universalEmail, setUniversalEmail, setPage, setKOD } =
    useContext(RecoveryContext);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function elkuld() {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const kod = Math.floor(Math.random() * 9000 + 1000);
    setKOD(kod);
    setUniversalEmail(email);

    axios
      .post("http://localhost:3500/emailkuldes", {
        KOD: kod,
        email: email,
      })
      .then(() => setPage("code"))
      .catch(() => setError("Valami hiba történt"));
  }

  return (
    <div className="form-container">
      <form onSubmit={elkuld} className="addcomp">
        <h2>Add meg az email címed!</h2>
        <div className="form-row">
          <input
            type="email"
            value={email}
            placeholder="Email-cím"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="send-btn">
          <button disabled={isLoading} type="submit">
            Elküld
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default EmailSending;
