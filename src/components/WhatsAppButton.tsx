import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  className?: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  className = '', 
  message = "Hello, I'm interested in your boundary wall services." 
}) => {
  const { t } = useLanguage();
  const phoneNumber = '+919548114154'; // Balaji Boundary Walls WhatsApp number

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleWhatsAppClick}
      className={`flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      <span>{t('whatsappUs')}</span>
    </motion.button>
  );
};

export default WhatsAppButton;