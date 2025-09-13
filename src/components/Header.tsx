import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50"
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 group-hover:scale-110 transition-transform" />
            <span className="text-lg sm:text-xl font-bold text-gray-800">Balaji Boundary Walls</span>
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
              to="/services" 
              className={`font-medium transition-colors hover:text-orange-600 ${
                isActive('/services') ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              {t('services')}
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
              className="flex items-center space-x-1 px-2 py-1 sm:px-3 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'hi' ? 'EN' : 'हि'}
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-3 pt-4">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium transition-colors hover:text-orange-600 ${
                  isActive('/') ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {t('home')}
              </Link>
              <Link 
                to="/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium transition-colors hover:text-orange-600 ${
                  isActive('/products') ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {t('products')}
              </Link>
              <Link 
                to="/services" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium transition-colors hover:text-orange-600 ${
                  isActive('/services') ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {t('services')}
              </Link>
              <Link 
                to="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium transition-colors hover:text-orange-600 ${
                  isActive('/admin') ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {t('admin')}
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;