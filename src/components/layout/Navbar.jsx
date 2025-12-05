import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../../assets/css/Navbar.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    return (
        <header className={`navbar-main ${scrolled ? "scrolled" : ""}`}>

            {/* LEFT MENU — BRAND NAME */}
            <div className="navbar-left">
                <div className="navbar-brand">TSR Invoice</div>
            </div>


            {/* CENTER MENU ITEMS */}
            <ul className={`navbar-center ${menuOpen ? "open" : ""}`}>

                {/* ==== PRODUCTS WITH SUBMENU ==== */}
                <li className="nav-dropdown">
                    Products ▾
                    <ul className="dropdown-menu">
                        <li>
                            <Link to="/products/payroll">Payroll</Link>
                        </li>
                        <li>
                            <Link to="/products/invoice">Invoice</Link>
                        </li>
                    </ul>
                </li>

                <li className={location.pathname === "/about" ? "active" : ""}>
                    <Link to="/about">About</Link>
                </li>

                <li className={location.pathname === "/services" ? "active" : ""}>
                    <Link to="/services">Services</Link>
                </li>

                <li className={location.pathname === "/contact" ? "active" : ""}>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>


            {/* RIGHT MENU ITEM - Get Started*/}
            <div className="navbar-right">
                <Link to="/get-started" className="get-started-btn">
                    Get Started
                </Link>
            </div>

            {/* MOBILE HAMBURGER */}
            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
        </header>
    );
};

export default Navbar;
