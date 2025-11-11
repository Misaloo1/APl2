import React, { createContext, useState } from "react";
import { ThemeProvider } from "styled-components";

const lightTheme = {
  background: "#ffffff",
  text: "#000000",
};

const darkTheme = {
  background: "#000000",
  text: "#ffffff",
};

export const ThemeContext = createContext();

export default function CustomThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");

  const toggleTheme = (name) => {
    setThemeName(name);
  };

  const theme = themeName === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
