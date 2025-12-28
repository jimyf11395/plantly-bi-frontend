import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "./plantly.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <img src={logo} alt="Plantly BI" className="nav-logo" />
        </Link>

        {/* Header links (visible on wider screens) */}
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          {/* Grouped header: Maintenance -> (KPIs, Users) */}
          <div className="nav-group">
            <button className="nav-group-label" aria-haspopup="true">
              Maintenance ▾
            </button>
            <div className="nav-group-links" aria-label="Maintenance links">
              <Link to="/kpi" className="nav-link">
                KPIs
              </Link>
              <Link to="/users" className="nav-link">
                Users
              </Link>
            </div>
          </div>
        </div>

        {/* Logout button on the right */}
        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>

        {/* Slide-in panel */}
        <div className={`nav-overlay ${isOpen ? "show" : ""}`}>
          <button
            className="close-panel"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
          <div className="panel-links">
            <Link
              to="/dashboard"
              className="panel-link"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/kpi"
              className="panel-link"
              onClick={() => setIsOpen(false)}
            >
              KPIs
            </Link>
            <Link
              to="/users"
              className="panel-link"
              onClick={() => setIsOpen(false)}
            >
              Users
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
