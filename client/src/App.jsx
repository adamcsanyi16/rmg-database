import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Notfound from "./pages/Notfound/Notfound";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Addcomp from "./pages/Addinfo/Addcomp";
import Results from "./pages/Info/Results";
import Updatecomp from "./pages/Updateinfo/Updatecomp";

function App() {
  const { user } = useAuthContext();

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="*" element={<Notfound />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={!user ? <Registration /> : <Navigate to="/eredmenyek" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/eredmenyek" />}
          />
          <Route
            path="/versenyfelvetel"
            element={user ? <Addcomp /> : <Navigate to="/login" />}
          />
          <Route
            path="/eredmenyek/:id"
            element={user ? <Updatecomp /> : <Navigate to="/login" />}
          />
          <Route
            path="/eredmenyek"
            element={user ? <Results /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
