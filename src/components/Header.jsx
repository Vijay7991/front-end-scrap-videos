import { useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAppTheme } from "../context/ThemeContext";

import Logo from "./Logo";
import "./Header.css";

const menu = [
  { name: "Home",        path: "/" },
  { name: "Trending",    path: "/category/trending" },
  { name: "Web Series",  path: "/category/webseries" },
  { name: "Viral Videos",path: "/category/viral" },
  { name: "DMCA",        path: "/dmca" },
];

function Header({ openMenu }) {

  const { theme: appTheme, toggleTheme } = useAppTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]           = useState("");
  const [scrolled, setScrolled]     = useState(false);

  const searchRef = useRef(null);
  const navigate  = useNavigate();
  const location  = useLocation();
  const isMobile  = useMediaQuery("(max-width:960px)");

  /* close search on route change */
  useEffect(() => { setSearchOpen(false); setQuery(""); }, [location]);

  /* track scroll for shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* autofocus search input */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSearchOpen(false);
  };

  const isLight = appTheme === "light";

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}${isLight ? " light" : " dark"}`}>

      <div className="header-inner">

        {/* ── LEFT: hamburger (mobile) + logo ── */}
        <div className="header-left">
          {isMobile && (
            <button className="hdr-icon-btn menu-btn" onClick={openMenu} aria-label="Open menu">
              <MenuIcon fontSize="small" />
            </button>
          )}
          <Logo />
        </div>

        {/* ── CENTER: desktop nav ── */}
        {!isMobile && (
          <nav className="header-nav">
            {menu.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        )}

        {/* ── RIGHT: theme toggle + search ── */}
        <div className="header-right">

          {/* Search bar (expands inline) */}
          <div className={`search-bar${searchOpen ? " open" : ""}`}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              placeholder="Search videos…"
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            {searchOpen && (
              <button className="hdr-icon-btn" onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Close search">
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>

          <button
            className="hdr-icon-btn search-btn"
            onClick={searchOpen ? handleSearch : () => setSearchOpen(true)}
            aria-label="Search"
          >
            <SearchIcon fontSize="small" />
          </button>

          {/* Theme toggle */}
          <button
            className="hdr-icon-btn theme-btn"
            onClick={toggleTheme}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle theme"
          >
            <span className="theme-icon">
              {isLight
                ? <DarkModeRoundedIcon fontSize="small" />
                : <LightModeRoundedIcon fontSize="small" />}
            </span>
          </button>

        </div>

      </div>

    </header>
  );
}

export default Header;
