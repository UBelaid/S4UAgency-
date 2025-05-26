import { useAppContext } from "../context/LanguageContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode, toggleDarkMode, language, toggleLanguage } =
    useAppContext();

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          aria-label={
            language === "en" ? "Switch to French" : "Switch to English"
          }
        >
          🌐
        </button>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      {children}
    </div>
  );
};

export default Layout;
