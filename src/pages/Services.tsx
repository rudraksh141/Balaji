import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Wrench, Award, Clock, Users, CheckCircle, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Service, ServiceHighlight } from '../types/Service';
import WhatsAppButton from '../components/WhatsAppButton';

const Services: React.FC = () => {
  const { t } = useLanguage();
  const [services] = useLocalStorage<Service[]>('services', [
    {
      id: '1',
      title: 'Boundary Walls',
      description: 'Complete boundary wall construction with precast concrete, brick, and RCC options',
      price: '₹150/sq ft onwards',
      imageUrl: 'https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Precast Concrete', 'Brick Construction', 'RCC Walls', 'Custom Heights'],
      category: 'Construction',
      isHighlighted: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Garden Benches',
      description: 'Durable and comfortable concrete benches for parks, gardens, and public spaces',
      price: '₹2,500/piece onwards',
      imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Weather Resistant', 'Multiple Designs', 'Custom Sizes', 'Easy Installation'],
      category: 'Furniture',
      isHighlighted: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      title: 'Fencing Poles',
      description: 'High-quality concrete fencing poles for secure and long-lasting boundaries',
      price: '₹180/piece onwards',
      imageUrl: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Pre-stressed Concrete', 'Various Heights', 'Corner Posts', 'Gate Posts'],
      category: 'Fencing',
      isHighlighted: false,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
    {
      id: '4',
      title: 'Custom Solutions',
      description: 'Tailored concrete solutions for your specific construction needs',
      price: 'Quote on Request',
      imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Site Survey', 'Custom Design', 'Quality Materials', 'Professional Installation'],
      category: 'Custom',
      isHighlighted: false,
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04'),
    }
  ]);

  const [highlights] = useLocalStorage<ServiceHighlight[]>('serviceHighlights', [
    {
      id: '1',
      title: 'No Delivery Charges',
      description: 'Free delivery to your location within our service area',
      icon: 'Truck',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      title: 'No Installation Charges',
      description: 'Professional installation included in the price',
      icon: 'Wrench',
      isActive: true,
      order: 2
    },
    {
      id: '3',
      title: 'Quick Delivery',
      description: 'Fast turnaround time for all orders',
      icon: 'Clock',
      isActive: true,
      order: 3
    },
    {
      id: '4',
      title: 'Quality Guarantee',
      description: 'Premium materials with assured quality',
      icon: 'Shield',
      isActive: true,
      order: 4
    }
  ]);

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Truck, Wrench, Clock, Shield, Award, Users
    };
    return icons[iconName] || Shield;
  };

  // Get recent services (last 30 days or latest 3)
  const recentServices = services
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const activeHighlights = highlights
    .filter(h => h.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50 pt-4 sm:pt-8 pb-16 sm:pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 px-4">
            {t('ourServices')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Complete concrete solutions for your construction needs with professional quality and service
          </p>
        </motion.div>

        {/* Key Selling Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 text-white"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
            Why Choose Balaji Boundary Walls?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeHighlights.map((highlight, index) => {
              const IconComponent = getIcon(highlight.icon);
              return (
                <motion.div
                  key={highlight.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`text-center p-4 rounded-xl ${
                    highlight.title.includes('No') 
                      ? 'bg-white/20 border-2 border-white/30 shadow-lg' 
                      : 'bg-white/10'
                  }`}
                >
                  <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3" />
                  <h3 className="font-bold text-sm sm:text-base mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    {highlight.description}
                  </p>
                  {highlight.title.includes('No') && (
                    <div className="mt-2">
                      <CheckCircle className="h-5 w-5 mx-auto text-green-300" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Updates Section */}
        {recentServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Star className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Latest Services & Updates
              </h2>
              <Star className="h-6 w-6 text-orange-600 ml-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-l-4 border-orange-500"
                >
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        New
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {service.description.substring(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-bold text-sm">
                        {service.price}
                      </span>
                      <span className="text-xs text-gray-500">
                        {service.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                service.isHighlighted ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-orange-600 text-white p-2 rounded-lg">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
                {service.isHighlighted && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Popular
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {service.title}
                  </h3>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {service.category}
                  </span>
                </div>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {service.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg sm:text-xl font-bold text-orange-600">
                    {service.price}
                  </span>
                </div>
                
                <WhatsAppButton
                  message={`Hello, I'm interested in ${service.title}. Please provide more details and quotation.`}
                  className="w-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            Get in touch with us today for a free consultation and quotation. 
            Our experienced team is ready to help you with all your concrete construction needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <WhatsAppButton
              message="Hello, I would like to get a free consultation and quotation for my project."
              className="flex-1"
            />
            <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base">
              Call Now: +91 9548114154
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;