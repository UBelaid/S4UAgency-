import React, { createContext, useContext, useState } from "react";

interface LanguageContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: "en" | "fr";
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

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
    delete: "Delete",
    cancel: "Cancel",
    export: "Export to Excel",
    import: "Import from Excel",
    search: "Search...",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    actions: "Actions",
    confirmDelete: "Are you sure you want to delete this record?",
    welcomeMessage: "Welcome back",
    userPlaceholder: "User",
    totalClients: "Total Clients",
    totalSales: "Total Sales",
    totalSuppliers: "Total Suppliers",
    totalProducts: "Total Products",
    totalPurchases: "Total Purchases",
    todayIs: "It’s",
    register: "Register",
    login: "Login",
    username: "Username",
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
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    isRequired: "is required",
    noData: "No clients found",
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
    delete: "Supprimer",
    cancel: "Annuler",
    export: "Exporter vers Excel",
    import: "Importer depuis Excel",
    search: "Rechercher...",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    actions: "Actions",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cet enregistrement ?",
    welcomeMessage: "Bon retour",
    userPlaceholder: "Utilisateur",
    totalClients: "Total des clients",
    totalSales: "Ventes totales",
    totalSuppliers: "Total des fournisseurs",
    totalProducts: "Total des produits",
    totalPurchases: "Total des achats",
    todayIs: "C’est",
    register: "Inscription",
    login: "Connexion",
    username: "Nom d’utilisateur",
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
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    of: "de",
    isRequired: "est requis",
    noData: "Aucun client trouvé",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "fr">("en");

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));

  return (
    <LanguageContext.Provider
      value={{ darkMode, toggleDarkMode, language, toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
};

export const useTranslations = () => {
  const { language } = useLanguageContext();
  return translations[language];
};
