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
import Addraces from "./pages/Addinfo/Addraces";
import Reset from "./pages/ResetPass/Reset";
import Addagazat from "./pages/Addinfo/Addagazat";

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
            path="/regisztracio"
            element={!user ? <Registration /> : <Navigate to="/eredmenyek" />}
          />
          <Route
            path="/belepes"
            element={!user ? <Login /> : <Navigate to="/eredmenyek" />}
          />
          <Route
            path="/eredmenyekfelvetel"
            element={user ? <Addcomp /> : <Navigate to="/belepes" />}
          />
          <Route
            path="/agazatfelvetel"
            element={user ? <Addagazat /> : <Navigate to="/belepes" />}
          />
          <Route
            path="/versenyfelvetel"
            element={user ? <Addraces /> : <Navigate to="/belepes" />}
          />
          <Route
            path="/eredmenyek/:id"
            element={user ? <Updatecomp /> : <Navigate to="/belepes" />}
          />
          <Route
            path="/eredmenyek"
            element={user ? <Results /> : <Navigate to="/belepes" />}
          />
          <Route path="/valtoztat" element={<Reset />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
