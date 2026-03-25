import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";

function ScrollTop() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {

    window.addEventListener("scroll", () => {
      setVisible(window.scrollY > 300);
    });

  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (

    <Fab
      onClick={scrollTop}
      sx={{
        position: "fixed",
        bottom: 30,
        right: 30
      }}
    >
      <KeyboardArrowUpIcon />
    </Fab>

  );

}

export default ScrollTop;