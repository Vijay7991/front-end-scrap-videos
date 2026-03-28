import { Typography } from "@mui/material";

function Logo() {

  return (

    <Typography
      sx={{
        fontSize: "28px",
        fontWeight: "bold",
        color: "transparent",
        WebkitTextStroke: "1px white",
        background: "linear-gradient(45deg,#fff,#ff80ff)",
        WebkitBackgroundClip: "text",
        letterSpacing: "2px"
      }}
    >
      BFMILK.COM
    </Typography>

  );

}

export default Logo;