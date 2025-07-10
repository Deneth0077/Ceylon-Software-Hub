import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import AddProductForm from '../../components/AddProductForm';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/products', formData);
      
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      const message = error.response?.data?.message || 'Failed to create product';
      toast.error(message);
      throw error; // Re-throw to prevent form reset
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/products')}
            className="inline-flex items-center space-x-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky-100 dark:bg-sky-900/20 rounded-xl">
              <Package className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Add New Product
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Create a new software product for your marketplace
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <AddProductForm
          onSubmit={handleSubmit}
          loading={loading}
          submitText="Create Product"
        />
      </div>
    </div>
  );
};

export default AddProduct;