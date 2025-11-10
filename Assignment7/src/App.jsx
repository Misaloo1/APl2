import React from "react";
import CustomThemeProvider from "./theme/ThemeContext";
import GlobalStyles from "./theme/GlobalStyles";
import ThemeSwitcher from "./components/ThemeSwitcher";

function App() {
  return (
    <CustomThemeProvider>
      <GlobalStyles />
      <ThemeSwitcher />

      <div style={{ padding: 20 }}>
        <h1>Welcome to the Theme Customizer App</h1>
        <p>Click a button above to change the theme.</p>
      </div>
    </CustomThemeProvider>
  );
}

export default App;
