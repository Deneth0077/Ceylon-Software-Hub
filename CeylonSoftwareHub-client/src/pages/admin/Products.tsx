import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Download,
  Save,
  X,
  Upload
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddProductForm from '../../components/AddProductForm';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: { url: string; alt: string }[];
  downloadUrl: string;
  systemRequirements: {
    os: string[];
    processor: string;
    memory: string;
    storage: string;
  };
  version: string;
  license: string;
  tags: string[];
  features: string[];
  downloads: number;
  rating: { average: number; count: number };
  isActive: boolean;
  createdBy: { name: string };
  createdAt: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  downloadUrl: string;
  systemRequirements: {
    os: string[];
    processor: string;
    memory: string;
    storage: string;
  };
  version: string;
  license: string;
  tags: string[];
  features: string[];
  isActive: boolean;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category: 'software & apps',
    downloadUrl: '',
    systemRequirements: {
      os: [],
      processor: '',
      memory: '',
      storage: ''
    },
    version: '1.0.0',
    license: 'single',
    tags: [],
    features: [],
    isActive: true
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'software & apps', label: 'Software & Apps' },
    { value: 'MS office keys', label: 'MS Office Keys' },
    { value: 'Windows Keys', label: 'Windows Keys' },
    { value: 'PC games', label: 'PC Games' },
    { value: 'Cracked', label: 'Cracked' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedStatus, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus
      });

      const response = await axios.get(`/api/admin/products?${params}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, data);
        toast.success('Product updated successfully');
      } else {
        await axios.post('/api/products', data);
        toast.success('Product created successfully');
      }
      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/api/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      const message = error.response?.data?.message || error.message || 'Failed to delete product';
      toast.error(message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'software & apps',
      downloadUrl: '',
      systemRequirements: {
        os: [],
        processor: '',
        memory: '',
        storage: ''
      },
      version: '1.0.0',
      license: 'single',
      tags: [],
      features: [],
      isActive: true
    });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      downloadUrl: product.downloadUrl,
      systemRequirements: product.systemRequirements,
      version: product.version,
      license: product.license,
      tags: product.tags,
      features: product.features,
      isActive: product.isActive
    });
    setShowAddModal(true);
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Product Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your software products and inventory
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setCurrentPage(1);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.images[0]?.url || `https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=100`}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-400">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <Download className="h-4 w-4" />
                          <span>{product.downloads}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(`/products/${product._id}`, '_blank')}
                            className="p-2 text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                            title="View Product"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(formData);
              }} className="p-6 space-y-6">
                <AddProductForm
                  onSubmit={(data) => handleSubmit(data)}
                  initialData={formData}
                  loading={loading}
                  submitText={editingProduct ? 'Update Product' : 'Create Product'}
                />
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get started by adding your first product
            </p>
            <button
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowAddModal(true);
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;