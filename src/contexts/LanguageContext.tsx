import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
}

const translations = {
  hi: {
    // Navigation
    home: 'होम',
    products: 'उत्पाद',
    admin: 'एडमिन',
    gallery: 'गैलरी',
    
    // Home Page
    heroText: 'अब तक 100000+ sq. ft. boundary लगा चुके हैं',
    subText: 'आपके सपनों की दीवार हमारी जिम्मेदारी',
    contactUs: 'संपर्क करें',
    whatsappUs: 'व्हाट्सऐप पर मैसेज करें',
    ourServices: 'हमारी सेवाएं',
    whyChooseUs: 'हमें क्यों चुनें',
    qualityWork: 'गुणवत्तापूर्ण कार्य',
    experiencedTeam: 'अनुभवी टीम',
    affordablePrices: 'किफायती दरें',
    timelyDelivery: 'समय पर डिलीवरी',
    
    // Products
    ourProducts: 'हमारे उत्पाद',
    viewDetails: 'विवरण देखें',
    addToInquiry: 'पूछताछ में जोड़ें',
    
    // Admin
    adminPanel: 'एडमिन पैनल',
    addProduct: 'उत्पाद जोड़ें',
    manageProducts: 'उत्पाद प्रबंधन',
    productName: 'उत्पाद का नाम',
    price: 'मूल्य',
    description: 'विवरण',
    imageUrl: 'छवि URL',
    save: 'सेव करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    
    // Common
    loading: 'लोड हो रहा है...',
    close: 'बंद करें',
  },
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    admin: 'Admin',
    gallery: 'Gallery',
    
    // Home Page
    heroText: 'Ab tak 100000+ sq. ft. boundary laga chuke hain',
    subText: 'Your dream wall is our responsibility',
    contactUs: 'Contact Us',
    whatsappUs: 'Message on WhatsApp',
    ourServices: 'Our Services',
    whyChooseUs: 'Why Choose Us',
    qualityWork: 'Quality Work',
    experiencedTeam: 'Experienced Team',
    affordablePrices: 'Affordable Prices',
    timelyDelivery: 'Timely Delivery',
    
    // Products
    ourProducts: 'Our Products',
    viewDetails: 'View Details',
    addToInquiry: 'Add to Inquiry',
    
    // Admin
    adminPanel: 'Admin Panel',
    addProduct: 'Add Product',
    manageProducts: 'Manage Products',
    productName: 'Product Name',
    price: 'Price',
    description: 'Description',
    imageUrl: 'Image URL',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    
    // Common
    loading: 'Loading...',
    close: 'Close',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['hi']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};