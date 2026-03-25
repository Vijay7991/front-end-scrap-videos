import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f0f0f",
      paper: "#181818"
    },
    primary: {
      main: "#ff0000"
    }
  }
});

export default theme;