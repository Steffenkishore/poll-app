import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdCancelPresentation } from "react-icons/md";
import Cookies from "js-cookie";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./index.css";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  const logoutFunction = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
  };

  // Nav links data
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/create-poll", label: "Create Polls" },
    { to: "/live-polls", label: "Available Polls" },
    { to: "/my-polls", label: "My Polls" },
    { to: "/voted-polls", label: "Voted Polls" },
  ];

  return (
    <>
      <nav className="navbar">
        <h1 className="navbar-logo">Poll App</h1>

        {/* Desktop Menu */}
        <ul className="nav-list">
          {navLinks.map(({ to, label }) => (
            <li
              key={to}
              className={`nav-item${location.pathname === to ? " active" : ""}`}
            >
              <Link to={to} className="nav-link">
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button className="btn-logout" onClick={logoutFunction}>
              Logout
            </button>
          </li>
        </ul>

        {/* Hamburger icon */}
        <button
          className="menu-toggle"
          onClick={() => setShowMenu(!showMenu)}
          aria-label={showMenu ? "Close menu" : "Open menu"}
          aria-expanded={showMenu}
        >
          {showMenu ? (
            <MdCancelPresentation size={28} />
          ) : (
            <RxHamburgerMenu size={28} />
          )}
        </button>
      </nav>

      {/* Mobile Slide-in Menu */}
      <aside
        className={`mobile-menu${showMenu ? " visible" : ""}`}
        role="menu"
        aria-hidden={!showMenu}
      >
        <ul className="mobile-nav-list">
          {navLinks.map(({ to, label }) => (
            <li
              key={to}
              className={`mobile-nav-item${
                location.pathname === to ? " active" : ""
              }`}
            >
              <Link
                to={to}
                className="mobile-nav-link"
                onClick={() => setShowMenu(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="btn-logout mobile-logout-btn"
              onClick={logoutFunction}
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>
      {/* Overlay behind the mobile menu */}
      {showMenu && (
        <div
          className="overlay"
          onClick={() => setShowMenu(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Navbar;
