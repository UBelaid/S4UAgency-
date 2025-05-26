import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: "en" | "fr";
  toggleLanguage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  en: {
    clients: "Clients",
    suppliers: "Suppliers",
    products: "Products",
    sales: "Sales",
    purchases: "Purchases",
    logout: "Logout",
    dashboard: "Dashboard",
    add: "Add",
    edit: "Edit",
    update: "Update",
    cancel: "Cancel",
    export: "Export to Excel",
    import: "Import from Excel",
    search: "Search...",
    // Register and Login translations
    register: "Register",
    login: "Login",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    pin: "PIN",
    role: "Role",
    employee: "Employee",
    admin: "Admin",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    loginHere: "Login here",
    registerHere: "Register here",
  },
  fr: {
    clients: "Clients",
    suppliers: "Fournisseurs",
    products: "Produits",
    sales: "Ventes",
    purchases: "Achats",
    logout: "Déconnexion",
    dashboard: "Tableau de bord",
    add: "Ajouter",
    edit: "Modifier",
    update: "Mettre à jour",
    cancel: "Annuler",
    export: "Exporter vers Excel",
    import: "Importer depuis Excel",
    search: "Rechercher...",
    // Register and Login translations
    register: "Inscription",
    login: "Connexion",
    username: "Nom d’utilisateur",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    pin: "PIN",
    role: "Rôle",
    employee: "Employé",
    admin: "Administrateur",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    loginHere: "Connectez-vous ici",
    registerHere: "Inscrivez-vous ici",
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "fr">("en");

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));

  return (
    <AppContext.Provider
      value={{ darkMode, toggleDarkMode, language, toggleLanguage }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const useTranslations = () => {
  const { language } = useAppContext();
  return translations[language];
};
