import Link from "next/link";
import { useRouter } from "next/router";
import {
  useLanguageContext,
  useTranslations,
} from "../context/LanguageContext";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { language, toggleLanguage, darkMode, toggleDarkMode } =
    useLanguageContext();
  const t = useTranslations();

  const navItems = [
    { name: t.dashboard, path: "/dashboard", icon: "🏠" },
    { name: t.clients, path: "/clients", icon: "👥" },
    { name: t.suppliers, path: "/suppliers", icon: "🤝" },
    { name: t.products, path: "/products", icon: "📦" },
    { name: t.sales, path: "/sales", icon: "💰" },
    { name: t.purchases, path: "/purchases", icon: "🛒" },
  ];

  console.log("Nav Items:", navItems); // Debug log to verify items

  return (
    <div
      className={`w-64 h-screen ${
        darkMode
          ? "bg-gradient-to-b from-gray-800 to-gray-900"
          : "bg-gradient-to-b from-gray-200 to-gray-300"
      } text-white flex flex-col shadow-2xl`}
    >
      <div
        className={`p-6 border-b ${
          darkMode ? "border-gray-700" : "border-gray-400"
        } flex justify-between items-center`}
      >
        <h1
          className={`text-3xl font-bold ${
            darkMode
              ? "bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
              : "text-gray-800"
          }`}
        >
          CRM Pro
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleLanguage}
            className={`px-3 py-1 rounded-full transition ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            aria-label={
              language === "en" ? "Switch to French" : "Switch to English"
            }
          >
            🌐
          </button>
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1 rounded-full transition ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            aria-label={
              darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
      <nav className="flex-1 p-6">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                  router.pathname === item.path
                    ? `${
                        darkMode
                          ? "bg-purple-600 text-white"
                          : "bg-purple-400 text-gray-800"
                      }`
                    : `${
                        darkMode
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-400 hover:text-gray-900"
                      }`
                }`}
              >
                <span className="mr-4">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => router.push("/login")}
              className={`flex items-center p-3 rounded-lg w-full text-left transition-all duration-200 ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-400 hover:text-gray-900"
              }`}
            >
              <span className="mr-4">🚪</span>
              {t.logout}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
