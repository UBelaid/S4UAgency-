import Link from 'next/link';
import { useAppContext } from '../context/LanguageContext';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
  const { darkMode } = useAppContext();

  const summaryItems = [
    { name: 'Clients', count: 120, path: '/clients', color: 'bg-blue-500' },
    { name: 'Suppliers', count: 45, path: '/suppliers', color: 'bg-green-500' },
    { name: 'Products', count: 300, path: '/products', color: 'bg-yellow-500' },
    { name: 'Sales', count: 180, path: '/sales', color: 'bg-red-500' },
    { name: 'Purchases', count: 90, path: '/purchases', color: 'bg-purple-500' },
  ];

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <div
                className={`${item.color} p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-white cursor-pointer`}
              >
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-4xl mt-2">{item.count}</p>
                <p className="text-sm mt-1">Total {item.name.toLowerCase()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;