import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider ");
  }
  const { user } = context;
  const isAdmin = user ? user.isAdmin : false;

  return { ...context, isAdmin };
};
