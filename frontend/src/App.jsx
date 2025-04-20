import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import PostProperty from "./pages/PostProperty";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyListings from "./pages/MyListings";
import EditProperty from "./pages/EditProperty";

const App = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    alert("Logged out!");
    navigate("/");
  };

  const goHomeAndRefresh = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold text-primary"
            onClick={goHomeAndRefresh}
            style={{ cursor: "pointer" }}
          >
            99acres Clone
          </span>
          <div className="d-flex align-items-center gap-3">
            <span
              onClick={goHomeAndRefresh}
              className="nav-link"
              style={{ cursor: "pointer" }}
            >
              Home
            </span>
            <Link className="nav-link" to="/post">
              Post Property
            </Link>
            {isLoggedIn && (
              <Link className="nav-link" to="/my-listings">
                My Listings
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <span className="navbar-text">
                  Welcome{userName ? `, ${userName}` : ""}!
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary btn-sm" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Routes */}
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<PostProperty />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/edit/:id" element={<EditProperty />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
