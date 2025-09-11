import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Upload, Lock, Star, Shield, Truck, Wrench, Clock, Award, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types/Product';
import { Service, ServiceHighlight } from '../types/Service';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'highlights'>('products');
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProductImage, setSelectedProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string>('');
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });

  // Services state
  const [services, setServices] = useLocalStorage<Service[]>('services', []);
  const [isEditingService, setIsEditingService] = useState<string | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedServiceImage, setSelectedServiceImage] = useState<File | null>(null);
  const [serviceImagePreview, setServiceImagePreview] = useState<string>('');
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    features: '',
    isHighlighted: false,
  });

  // Service highlights state
  const [highlights, setHighlights] = useLocalStorage<ServiceHighlight[]>('serviceHighlights', []);
  const [isEditingHighlight, setIsEditingHighlight] = useState<string | null>(null);
  const [isAddingHighlight, setIsAddingHighlight] = useState(false);
  const [highlightFormData, setHighlightFormData] = useState({
    title: '',
    description: '',
    icon: 'Shield',
    isActive: true,
    order: 1,
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234#') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  // Product handlers
  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductFormData({
      ...productFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedProductImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProductImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductImage && !isEditingProduct) {
      alert('Please select an image');
      return;
    }

    let imageUrl = '';
    
    if (selectedProductImage) {
      const reader = new FileReader();
      reader.onload = () => {
        imageUrl = reader.result as string;
        saveProduct(imageUrl);
      };
      reader.readAsDataURL(selectedProductImage);
    } else if (isEditingProduct) {
      const existingProduct = products.find(p => p.id === isEditingProduct);
      imageUrl = existingProduct?.imageUrl || '';
      saveProduct(imageUrl);
    }
  };

  // Fetch products from Firestore
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

  const saveProduct = async (imageUrl: string) => {
    const productData = {
      ...productFormData,
      imageUrl,
      createdAt: new Date(),
    };
    if (isEditingProduct) {
      await updateDoc(doc(db, "products", isEditingProduct), productData);
    } else {
      await addDoc(collection(db, "products"), productData);
    }
    // Refetch products after add/update
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData: Product[] = [];
    querySnapshot.forEach((doc) => {
      productsData.push({ id: doc.id, ...doc.data() } as Product);
    });
    setProducts(productsData);
    setIsEditingProduct(null);
    setIsAddingProduct(false);
    resetProductForm();
  };

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      price: '',
      description: '',
      category: '',
    });
    setSelectedProductImage(null);
    setProductImagePreview('');
  };

  // Delete product from Firestore
  const handleDeleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    setProducts(products.filter(p => p.id !== id));
  };

  // Service handlers
  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setServiceFormData({
      ...serviceFormData,
      [e.target.name]: value,
    });
  };

  const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedServiceImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setServiceImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedServiceImage && !isEditingService) {
      alert('Please select an image');
      return;
    }

    let imageUrl = '';
    
    if (selectedServiceImage) {
      const reader = new FileReader();
      reader.onload = () => {
        imageUrl = reader.result as string;
        saveService(imageUrl);
      };
      reader.readAsDataURL(selectedServiceImage);
    } else if (isEditingService) {
      const existingService = services.find(s => s.id === isEditingService);
      imageUrl = existingService?.imageUrl || '';
      saveService(imageUrl);
    }
  };

  const saveService = (imageUrl: string) => {
    const serviceData = {
      ...serviceFormData,
      imageUrl,
      features: serviceFormData.features.split(',').map(f => f.trim()),
    };
    
    if (isEditingService) {
      setServices(services.map(service => 
        service.id === isEditingService 
          ? { ...service, ...serviceData, updatedAt: new Date() }
          : service
      ));
      setIsEditingService(null);
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        ...serviceData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setServices([...services, newService]);
      setIsAddingService(false);
    }

    resetServiceForm();
  };

  const resetServiceForm = () => {
    setServiceFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      features: '',
      isHighlighted: false,
    });
    setSelectedServiceImage(null);
    setServiceImagePreview('');
  };

  // Highlight handlers
  const handleHighlightInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                  e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setHighlightFormData({
      ...highlightFormData,
      [e.target.name]: value,
    });
  };

  const handleHighlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditingHighlight) {
      setHighlights(highlights.map(highlight => 
        highlight.id === isEditingHighlight 
          ? { ...highlight, ...highlightFormData }
          : highlight
      ));
      setIsEditingHighlight(null);
    } else {
      const newHighlight: ServiceHighlight = {
        id: Date.now().toString(),
        ...highlightFormData,
      };
      setHighlights([...highlights, newHighlight]);
      setIsAddingHighlight(false);
    }

    resetHighlightForm();
  };

  const resetHighlightForm = () => {
    setHighlightFormData({
      title: '',
      description: '',
      icon: 'Shield',
      isActive: true,
      order: 1,
    });
  };

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600">
              Please enter the password to access the admin panel
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {passwordError && (
              <div className="text-red-600 text-sm text-center">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Access Admin Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 sm:pt-8 pb-16 sm:pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
              {t('adminPanel')}
            </h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'products' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'services' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'highlights' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Highlights ({highlights.length})
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {/* Add Product Button */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={() => setIsAddingProduct(true)}
                disabled={isEditingProduct || isAddingProduct}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus className="h-5 w-5" />
                <span>{t('addProduct')}</span>
              </button>
            </div>

            {/* Add/Edit Product Form */}
            {(isAddingProduct || isEditingProduct) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  {isEditingProduct ? 'Edit Product' : t('addProduct')}
                </h2>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('productName')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('price')}
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={productFormData.price}
                        onChange={handleProductInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={productFormData.category}
                        onChange={handleProductInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageChange}
                          className="hidden"
                          id="product-image-upload"
                        />
                        <label
                          htmlFor="product-image-upload"
                          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm sm:text-base"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Choose Image</span>
                        </label>
                        {selectedProductImage && (
                          <span className="text-xs sm:text-sm text-gray-600 break-all">
                            {selectedProductImage.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {productImagePreview && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Preview
                      </label>
                      <div className="w-24 h-24 sm:w-32 sm:h-32 border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={productImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('description')}
                    </label>
                    <textarea
                      name="description"
                      value={productFormData.description}
                      onChange={handleProductInputChange}
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4" />
                      <span>{t('save')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProduct(null);
                        setIsAddingProduct(false);
                        resetProductForm();
                      }}
                      className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                    >
                      <X className="h-4 w-4" />
                      <span>{t('close')}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Products List */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {t('manageProducts')} ({products.length})
              </h2>
              
              {products.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-gray-500 text-base sm:text-lg px-4">No products found. Add your first product!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                    >
                      <div className="w-full sm:w-32 md:w-48 h-32 sm:h-32 md:h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 space-y-2 sm:space-y-0">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-orange-600 font-bold text-base sm:text-lg">
                              {product.price}
                            </p>
                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs sm:text-sm mt-2">
                              {product.category}
                            </span>
                          </div>
                          <div className="flex space-x-2 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                setProductFormData({
                                  name: product.name,
                                  price: product.price,
                                  description: product.description,
                                  category: product.category,
                                });
                                setProductImagePreview(product.imageUrl);
                                setSelectedProductImage(null);
                                setIsEditingProduct(product.id);
                                setIsAddingProduct(false);
                              }}
                              disabled={isEditingProduct || isAddingProduct}
                              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                  handleDeleteProduct(product.id);
                                }
                              }}
                              disabled={isEditingProduct || isAddingProduct}
                              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">
                          {product.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            {/* Add Service Button */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={() => setIsAddingService(true)}
                disabled={isEditingService || isAddingService}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus className="h-5 w-5" />
                <span>Add Service</span>
              </button>
            </div>

            {/* Add/Edit Service Form */}
            {(isAddingService || isEditingService) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  {isEditingService ? 'Edit Service' : 'Add Service'}
                </h2>
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={serviceFormData.title}
                        onChange={handleServiceInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={serviceFormData.price}
                        onChange={handleServiceInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={serviceFormData.category}
                        onChange={handleServiceInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features (comma separated)
                      </label>
                      <input
                        type="text"
                        name="features"
                        value={serviceFormData.features}
                        onChange={handleServiceInputChange}
                        required
                        placeholder="Feature 1, Feature 2, Feature 3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Image
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleServiceImageChange}
                          className="hidden"
                          id="service-image-upload"
                        />
                        <label
                          htmlFor="service-image-upload"
                          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm sm:text-base"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Choose Image</span>
                        </label>
                        {selectedServiceImage && (
                          <span className="text-xs sm:text-sm text-gray-600 break-all">
                            {selectedServiceImage.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isHighlighted"
                          checked={serviceFormData.isHighlighted}
                          onChange={handleServiceInputChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Mark as Popular/Highlighted</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {serviceImagePreview && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Preview
                      </label>
                      <div className="w-24 h-24 sm:w-32 sm:h-32 border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={serviceImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={serviceFormData.description}
                      onChange={handleServiceInputChange}
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingService(null);
                        setIsAddingService(false);
                        resetServiceForm();
                      }}
                      className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Services List */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Manage Services ({services.length})
              </h2>
              
              {services.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-gray-500 text-base sm:text-lg px-4">No services found. Add your first service!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 ${
                        service.isHighlighted ? 'ring-2 ring-orange-500' : ''
                      }`}
                    >
                      <div className="w-full sm:w-32 md:w-48 h-32 sm:h-32 md:h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 space-y-2 sm:space-y-0">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                {service.title}
                              </h3>
                              {service.isHighlighted && (
                                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-orange-600 font-bold text-base sm:text-lg">
                              {service.price}
                            </p>
                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs sm:text-sm mt-2">
                              {service.category}
                            </span>
                          </div>
                          <div className="flex space-x-2 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                setServiceFormData({
                                  title: service.title,
                                  description: service.description,
                                  price: service.price,
                                  category: service.category,
                                  features: service.features.join(', '),
                                  isHighlighted: service.isHighlighted,
                                });
                                setServiceImagePreview(service.imageUrl);
                                setSelectedServiceImage(null);
                                setIsEditingService(service.id);
                                setIsAddingService(false);
                              }}
                              disabled={isEditingService || isAddingService}
                              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this service?')) {
                                  setServices(services.filter(s => s.id !== service.id));
                                }
                              }}
                              disabled={isEditingService || isAddingService}
                              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {service.features.map((feature, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Highlights Tab */}
        {activeTab === 'highlights' && (
          <div>
            {/* Add Highlight Button */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={() => setIsAddingHighlight(true)}
                disabled={isEditingHighlight || isAddingHighlight}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus className="h-5 w-5" />
                <span>Add Highlight</span>
              </button>
            </div>

            {/* Add/Edit Highlight Form */}
            {(isAddingHighlight || isEditingHighlight) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  {isEditingHighlight ? 'Edit Highlight' : 'Add Highlight'}
                </h2>
                <form onSubmit={handleHighlightSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={highlightFormData.title}
                        onChange={handleHighlightInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      <select
                        name="icon"
                        value={highlightFormData.icon}
                        onChange={handleHighlightInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="Shield">Shield</option>
                        <option value="Truck">Truck</option>
                        <option value="Wrench">Wrench</option>
                        <option value="Clock">Clock</option>
                        <option value="Award">Award</option>
                        <option value="Users">Users</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        name="order"
                        value={highlightFormData.order}
                        onChange={handleHighlightInputChange}
                        min="1"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={highlightFormData.isActive}
                          onChange={handleHighlightInputChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={highlightFormData.description}
                      onChange={handleHighlightInputChange}
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingHighlight(null);
                        setIsAddingHighlight(false);
                        resetHighlightForm();
                      }}
                      className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Highlights List */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Manage Highlights ({highlights.length})
              </h2>
              
              {highlights.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-gray-500 text-base sm:text-lg px-4">No highlights found. Add your first highlight!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {highlights
                    .sort((a, b) => a.order - b.order)
                    .map((highlight, index) => {
                      const IconComponent = getIcon(highlight.icon);
                      return (
                        <motion.div
                          key={highlight.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 ${
                            !highlight.isActive ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <IconComponent className="h-8 w-8 text-orange-600" />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setHighlightFormData({
                                    title: highlight.title,
                                    description: highlight.description,
                                    icon: highlight.icon,
                                    isActive: highlight.isActive,
                                    order: highlight.order,
                                  });
                                  setIsEditingHighlight(highlight.id);
                                  setIsAddingHighlight(false);
                                }}
                                disabled={isEditingHighlight || isAddingHighlight}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this highlight?')) {
                                    setHighlights(highlights.filter(h => h.id !== highlight.id));
                                  }
                                }}
                                disabled={isEditingHighlight || isAddingHighlight}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {highlight.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {highlight.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Order: {highlight.order}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              highlight.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {highlight.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getIcon(icon: string) {
  switch (icon) {
    case 'Shield': return Shield;
    case 'Truck': return Truck;
    case 'Wrench': return Wrench;
    case 'Clock': return Clock;
    case 'Award': return Award;
    case 'Users': return Users;
    default: return Shield;
  }
}

export default Admin;