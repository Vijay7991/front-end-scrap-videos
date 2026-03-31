import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MovieIcon from "@mui/icons-material/Movie";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GavelIcon from "@mui/icons-material/Gavel";

import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

import { NavLink } from "react-router-dom";

function MobileDrawer({ open, close }) {

  const menu = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Trending", path: "/trending", icon: <TrendingUpIcon /> },
    { name: "Web Series", path: "/category/webseries", icon: <MovieIcon /> },
    { name: "Viral Videos", path: "/category/viral", icon: <WhatshotIcon /> },
    { name: "DMCA Page", path: "/dmca", icon: <GavelIcon /> }
  ];

  return (

    <Drawer
      anchor="left"
      open={open}
      onClose={close}
      PaperProps={{
        sx: {
          width: 280,
          background: "linear-gradient(180deg,#0f0f0f,#1a1a1a)",
          color: "#fff",
          display: "flex",
          flexDirection: "column"
        }
      }}
    >

      {/* LOGO */}

      <Box
        sx={{
          p: 3,
          textAlign: "center",
          borderBottom: "1px solid #333"
        }}
      >

        <Typography
          sx={{
            fontSize: 28,
            fontWeight: "bold",
            letterSpacing: 2,
            background: "linear-gradient(45deg,#ff00cc,#3333ff)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: "logoGlow 3s ease-in-out infinite"
          }}
        >
          BFMILK.COM
        </Typography>

      </Box>


      {/* MENU */}

      <List sx={{ px: 1, mt: 1 }}>

        {menu.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            onClick={close}
            style={{ textDecoration: "none" }}
          >

            {({ isActive }) => (

              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: "0.3s",
                  background: isActive
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  "&:hover": {
                    background: "rgba(255,255,255,0.08)",
                    transform: "translateX(6px)"
                  }
                }}
              >

                <ListItemIcon sx={{ color: "#9ecfff" }}>
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.name} />

              </ListItemButton>

            )}

          </NavLink>

        ))}

      </List>


      <Divider sx={{ background: "#333", my: 2 }} />


      {/* SOCIAL MEDIA */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: "auto",
          mb: 3
        }}
      >

        <a
          href="https://t.me/+5ew4eXRpGhQ5ODk1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon
            sx={{
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                color: "#2ca5e0",
                transform: "scale(1.2)"
              }
            }}
          />
        </a>

        <InstagramIcon
          sx={{
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": {
              color: "#ff0080",
              transform: "scale(1.2)"
            }
          }}
        />

        <FacebookIcon
          sx={{
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": {
              color: "#1877f2",
              transform: "scale(1.2)"
            }
          }}
        />

      </Box>

    </Drawer>

  );

}

export default MobileDrawer;