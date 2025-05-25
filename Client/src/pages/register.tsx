import Link from 'next/link';
import { useAppContext } from '../context/LanguageContext';
import Layout from '../components/Layout';
import { useState } from 'react';

const translations = {
  en: {
    register: 'Register',
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    showPassword: 'Show Password',
    role: 'Role',
    employee: 'Employee',
    admin: 'Admin',
    pin: 'PIN',
    registerButton: 'Sign Up',
    alreadyRegistered: 'Already registered?',
    loginHere: 'Log In',
  },
  fr: {
    register: 'Inscription',
    fullName: 'Nom complet',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmez le mot de passe',
    showPassword: 'Afficher le mot de passe',
    role: 'Rôle',
    employee: 'Employé',
    admin: 'Administrateur',
    pin: 'PIN',
    registerButton: 'S’inscrire',
    alreadyRegistered: 'Déjà inscrit ?',
    loginHere: 'Se connecter',
  },
};

const RegisterPage = () => {
  const { language, darkMode } = useAppContext();
  const t = translations[language];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Layout>
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
        <h2 className="text-3xl font-bold text-center mb-8">{t.register}</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2">{t.fullName}</label>
            <input
              type="text"
              placeholder={t.fullName}
              className={`w-full px-4 py-3 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">{t.email}</label>
            <input
              type="email"
              placeholder={t.email}
              className={`w-full px-4 py-3 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">{t.password}</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t.password}
              className={`w-full px-4 py-3 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">{t.confirmPassword}</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t.confirmPassword}
              className={`w-full px-4 py-3 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-3 h-5 w-5"
            />
            <label className="text-lg">{t.showPassword}</label>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">{t.role}</label>
            <select
              className={`w-full px-4 py-3 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="employee">{t.employee}</option>
              <option value="admin">{t.admin}</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">{t.pin}</label>
            <input
              type="text"
              placeholder={t.pin}
              className={`w-full px-4 py-3 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <button className="w-full bg-purple-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition">
            {t.registerButton}
          </button>
          <p className="text-center text-lg">
            {t.alreadyRegistered}{' '}
            <Link href="/login" className="text-purple-600 hover:underline">{t.loginHere}</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;