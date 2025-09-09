import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Building2 className="h-8 w-8 text-orange-600 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-gray-800">Balaji Boundary Walls</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-orange-600 ${
                isActive('/') ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              {t('home')}
            </Link>
            <Link 
              to="/products" 
              className={`font-medium transition-colors hover:text-orange-600 ${
                isActive('/products') ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              {t('products')}
            </Link>
            <Link 
              to="/admin" 
              className={`font-medium transition-colors hover:text-orange-600 ${
                isActive('/admin') ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              {t('admin')}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'hi' ? 'EN' : 'हि'}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;