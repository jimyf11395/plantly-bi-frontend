import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        {/* Burger button */}
        <button
          className="burger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <Link to="/" className="nav-brand">
          Plantly BI
        </Link>

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
