import { ThemeProvider, createTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "./theme";
import ThemeContext from "./ThemeContext";

const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    setMode(
      localStorage.getItem("muiTheme")
        ? localStorage.getItem("muiTheme")
        : "light"
    );
  }, []);

  const modeTheme = createTheme({
    palette: {
      mode,
      ...theme.palette,
    },
  });
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={modeTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ModeProvider;
