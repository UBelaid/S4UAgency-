import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppContext, useTranslations } from '../context/LanguageContext';

const Sidebar = () => {
  const router = useRouter();
  const { language, toggleLanguage, darkMode, toggleDarkMode } = useAppContext();
  const t = useTranslations();

  const navItems = [
    { name: t.clients, path: '/clients', icon: '👥' },
    { name: t.suppliers, path: '/suppliers', icon: '🤝' },
    { name: t.products, path: '/products', icon: '📦' },
    { name: t.sales, path: '/sales', icon: '💰' },
    { name: t.purchases, path: '/purchases', icon: '🛒' },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-2xl">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          CRM Pro
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 bg-gray-700 rounded-full hover:bg-gray-600 transition"
            aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
          >
            🌐
          </button>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 bg-gray-700 rounded-full hover:bg-gray-600 transition"
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      <nav className="flex-1 p-6">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center p-3 rounded-lg ${
                  router.pathname === item.path
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } transition-all duration-200`}
              >
                <span className="mr-4">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => router.push('/login')}
              className="flex items-center p-3 rounded-lg w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
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