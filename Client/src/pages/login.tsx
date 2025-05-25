import Link from 'next/link';
import { useAppContext } from '../context/LanguageContext';
import Layout from '../components/Layout';
import { useState } from 'react';

const translations = {
  en: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    showPassword: 'Show Password',
    loginButton: 'Log In',
    noAccount: "Don't have an account?",
    registerHere: 'Sign Up',
  },
  fr: {
    login: 'Connexion',
    email: 'Email',
    password: 'Mot de passe',
    showPassword: 'Afficher le mot de passe',
    loginButton: 'Se connecter',
    noAccount: "Vous n'avez pas de compte ?",
    registerHere: 'Inscrivez-vous',
  },
};

const LoginPage = () => {
  const { language, darkMode } = useAppContext();
  const t = translations[language];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Layout>
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
        <h2 className="text-3xl font-bold text-center mb-8">{t.login}</h2>
        <div className="space-y-6">
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
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-3 h-5 w-5"
            />
            <label className="text-lg">{t.showPassword}</label>
          </div>
          <button className="w-full bg-purple-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition">
            {t.loginButton}
          </button>
          <p className="text-center text-lg">
            {t.noAccount} <Link href="/register" className="text-purple-600 hover:underline">{t.registerHere}</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;