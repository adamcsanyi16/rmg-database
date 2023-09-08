import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const url = "https://radnoti.adaptable.app/";

  const navigate = useNavigate();

  const register = async (email, jelszo, jelszoismetles) => {
    setIsLoading(true);
    setError(null);

    const adat = await fetch(url + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, jelszo, jelszoismetles }),
    });

    const response = await adat.json();

    if (!adat.ok) {
      setIsLoading(false);
      setError(response.error);
    }
    if (adat.ok) {
      localStorage.setItem("user", JSON.stringify(response));

      dispatch({ type: "LOGIN", payload: response });

      setIsLoading(false);
      navigate("/login");
    }
  };
  return { register, isLoading, error };
};
