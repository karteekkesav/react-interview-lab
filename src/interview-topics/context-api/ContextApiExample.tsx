import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeContext.Provider");
  }
  return context;
}

function Toolbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`demo-card theme-card ${theme}`}>
      <div>
        <h3>{theme === "dark" ? "Dark theme" : "Light theme"}</h3>
        <p>The nested toolbar reads theme from context.</p>
      </div>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
    </div>
  );
}

export default function ContextApiExample() {
  const [theme, setTheme] = useState<Theme>("light");

  const value: ThemeContextValue = {
    theme,
    toggleTheme: () =>
      setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light")),
  };

  return (
    <ThemeContext.Provider value={value}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
