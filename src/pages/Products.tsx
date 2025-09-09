import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types/Product';
import WhatsAppButton from '../components/WhatsAppButton';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Products: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiry, setInquiry] = useLocalStorage<Product[]>('inquiry', []);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  const addToInquiry = (product: Product) => {
    if (!inquiry.find(p => p.id === product.id)) {
      setInquiry([...inquiry, product]);
    }
  };

  const generateInquiryMessage = () => {
    if (inquiry.length === 0) return "Hello, I'm interested in your boundary wall services.";
    
    const productNames = inquiry.map(p => p.name).join(', ');
    return `Hello, I'm interested in the following products: ${productNames}. Please provide more details and quotation.`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('ourProducts')}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-orange-600">
                    {product.price}
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{t('viewDetails')}</span>
                  </button>
                  <button
                    onClick={() => addToInquiry(product)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{t('addToInquiry')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {inquiry.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Your Inquiry ({inquiry.length} items)
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {inquiry.map(product => (
                <span
                  key={product.id}
                  className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                >
                  {product.name}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <WhatsAppButton
                message={generateInquiryMessage()}
                className="flex-1"
              />
              <button
                onClick={() => setInquiry([])}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium transition-colors"
              >
                Clear Inquiry
              </button>
            </div>
          </motion.div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedProduct.description}
                </p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-orange-600">
                    {selectedProduct.price}
                  </span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => addToInquiry(selectedProduct)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {t('addToInquiry')}
                  </button>
                  <WhatsAppButton
                    message={`Hello, I'm interested in ${selectedProduct.name}. Please provide more details and quotation.`}
                    className="flex-1"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;