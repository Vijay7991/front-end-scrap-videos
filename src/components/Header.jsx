import {
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  InputBase,
  Box,
  Typography,
  useMediaQuery
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import { useTheme } from "@mui/material/styles";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Logo from "./Logo";

function Header({ openMenu }) {

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setQuery("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    setSearchOpen(false);
  }, [location]);

  const menu = [
    { name: "HOME", path: "/" },
    { name: "TRENDING", path: "/category/trending" },
    { name: "WEB SERIES", path: "/category/webseries" },
    { name: "VIRAL VIDEOS", path: "/category/viral" },
    { name: "DMCA PAGE", path: "/dmca" }
  ];

  return (

    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg,#ff0080,#6a00ff)"
      }}
    >

      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* MOBILE MENU BUTTON */}

        {isMobile && (
          <IconButton
            onClick={openMenu}
            sx={{
              border: "1px solid #fff",
              borderRadius: "8px",
              color: "#fff"
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* LOGO */}

        <Box
          sx={{
            width: { xs: "auto", md: "40%" },
            display: "flex",
            alignItems: "center"
          }}
        >
          <Logo />
        </Box>


        {/* DESKTOP MENU */}

        {!isMobile && (

          <Box
            sx={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1
            }}
          >

            {menu.map((item) => (

              <NavLink
                key={item.name}
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: isActive ? "bold" : "normal",
                  borderBottom: isActive ? "2px solid #fff" : "none",
                  paddingBottom: "3px"
                })}
              >
                {item.name}
              </NavLink>

            ))}

          </Box>

        )}


        {/* SEARCH */}

        <IconButton
          sx={{ color: "#fff" }}
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon />
        </IconButton>

      </Toolbar>


      {/* SEARCH DIALOG */}

      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        fullWidth
        maxWidth="sm"
      >

        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            width: "100%",
            alignItems: "center"
          }}
        >

          <InputBase
            autoFocus
            fullWidth
            value={query}
            placeholder="Search videos..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{
              borderBottom: "1px solid #ccc",
              pb: 1,
              fontSize: "16px"
            }}
          />

          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>

        </Box>

      </Dialog>

    </AppBar>

  );
}

export default Header;