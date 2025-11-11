import React, { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext";

export default function ThemeSwitcher() {
  const { toggleTheme, themeName } = useContext(ThemeContext);

  return (
    <div style={{ padding: 20 }}>
      <h3>Theme Customizer</h3>
      <button
        onClick={() => toggleTheme("light")}
        disabled={themeName === "light"}
      >
        Light Theme
      </button>
      <button
        onClick={() => toggleTheme("dark")}
        disabled={themeName === "dark"}
      >
        Dark Theme
      </button>
    </div>
  );
}
