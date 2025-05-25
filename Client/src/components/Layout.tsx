import { ReactNode } from "react";
import { useAppContext } from "../context/LanguageContext";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { language, toggleLanguage, darkMode, toggleDarkMode } =
    useAppContext();

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-black text-gray-200" : "bg-white text-gray-800"
      } flex items-center justify-center p-4 w-full`}
    >
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-full"
          aria-label={
            language === "en" ? "Switch to French" : "Switch to English"
          }
        >
          🌐
        </button>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-full"
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default Layout;
