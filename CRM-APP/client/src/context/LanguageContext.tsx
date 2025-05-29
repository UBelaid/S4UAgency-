"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LanguageContextProps {
  language: string;
  darkMode: boolean;
  toggleLanguage: () => void;
  toggleDarkMode: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
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
    search: "Search...",
    export: "Export to Excel",
    import: "Import from Excel",
    confirmDelete: "Are you sure you want to delete this item?",
    isRequired: "is required",
    mustBePositive: "must be a positive number",
    mustBeNonNegative: "must be a non-negative number",
    noData: "No data found",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    totalClients: "Total Clients",
    totalSuppliers: "Total Suppliers",
    totalProducts: "Total Products",
    totalSales: "Total Sales",
    totalPurchases: "Total Purchases",
    welcomeMessage: "Welcome",
    userPlaceholder: "User",
    todayIs: "It's",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    supplierName: "Supplier Name",
    contactName: "Contact Name",
    companyAddress: "Company Address",
    productName: "Product Name",
    description: "Description",
    price: "Price",
    stockQuantity: "Stock Quantity",
    category: "Category",
    client: "Client",
    product: "Product",
    quantity: "Quantity",
    totalPrice: "Total Price",
    saleDate: "Sale Date",
    totalCost: "Total Cost",
    purchaseDate: "Purchase Date",
    actions: "Actions",
    select: "Select",
    login: "Login",
    register: "Register",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    // Added for login/register pages
    dontHaveAccount: "Don't have an account?",
    registerHere: "Register here",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    username: "Username",
    confirmPassword: "Confirm Password",
    pin: "PIN",
    role: "Role",
    employee: "Employee",
    admin: "Admin",
    password: "Password",
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
    search: "Rechercher...",
    export: "Exporter vers Excel",
    import: "Importer depuis Excel",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cet élément ?",
    isRequired: "est requis",
    mustBePositive: "doit être un nombre positif",
    mustBeNonNegative: "doit être un nombre non négatif",
    noData: "Aucune donnée trouvée",
    page: "Page",
    of: "de",
    previous: "Précédent",
    next: "Suivant",
    totalClients: "Total Clients",
    totalSuppliers: "Total Fournisseurs",
    totalProducts: "Total Produits",
    totalSales: "Total Ventes",
    totalPurchases: "Total Achats",
    welcomeMessage: "Bienvenue",
    userPlaceholder: "Utilisateur",
    todayIs: "C’est",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    supplierName: "Nom du Fournisseur",
    contactName: "Nom du Contact",
    companyAddress: "Adresse de l’Entreprise",
    productName: "Nom du Produit",
    description: "Description",
    price: "Prix",
    stockQuantity: "Quantité en Stock",
    category: "Catégorie",
    client: "Client",
    product: "Produit",
    quantity: "Quantité",
    totalPrice: "Prix Total",
    saleDate: "Date de Vente",
    totalCost: "Coût Total",
    purchaseDate: "Date d’Achat",
    actions: "Actions",
    select: "Sélectionner",
    login: "Connexion",
    register: "Inscription",
    emailPlaceholder: "Entrez votre email",
    passwordPlaceholder: "Entrez votre mot de passe",
    // Added for login/register pages
    dontHaveAccount: "Vous n'avez pas de compte ?",
    registerHere: "Inscrivez-vous ici",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    loginHere: "Connectez-vous ici",
    username: "Nom d'utilisateur",
    confirmPassword: "Confirmer le mot de passe",
    pin: "PIN",
    role: "Rôle",
    employee: "Employé",
    admin: "Administrateur",
    password: "Mot de passe",
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <LanguageContext.Provider
      value={{ language, darkMode, toggleLanguage, toggleDarkMode }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  return context;
};

export const useTranslations = () => {
  const context = useLanguageContext();
  return translations[context.language as keyof typeof translations];
};
