import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Star, Download, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: { url: string; alt: string }[];
  rating: {
    average: number;
    count: number;
  };
  downloads: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addItem } = useCart();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'software & apps', label: 'Software & Apps' },
    { value: 'MS office keys', label: 'MS Office Keys' },
    { value: 'Windows Keys', label: 'Windows Keys' },
    { value: 'PC games', label: 'PC Games' },
    { value: 'Cracked', label: 'Cracked' }
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating.average', label: 'Highest Rated' },
    { value: '-downloads', label: 'Most Downloaded' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort: sortBy
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await axios.get(`/api/products?${params}`);
      setProducts(Array.isArray(response.data.products) ? response.data.products : []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]); // Ensure products is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || ''
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Software Products
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover premium software solutions for all your needs
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 mb-8 bg-white rounded-xl shadow-sm dark:bg-gray-800">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('-createdAt');
                setCurrentPage(1);
              }}
              className="flex justify-center items-center px-4 py-2 space-x-2 text-gray-700 bg-gray-100 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Filter className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm animate-pulse dark:bg-gray-800">
                <div className="mb-4 w-full h-48 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                <div className="mb-2 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="block bg-white rounded-xl shadow-sm transition-all duration-300 transform dark:bg-gray-800 hover:shadow-lg hover:-translate-y-1 group"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="overflow-hidden relative rounded-t-xl">
                    <img
                      src={product.images[0]?.url || `https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400`}
                      alt={product.name}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 text-sm font-medium text-white bg-sky-600 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                      {product.name}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center mb-3 space-x-1">
                      {renderStars(Math.round(product.rating.average))}
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        ({product.rating.count})
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                        Rs {product.price.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{product.downloads}</span>
                      </div>
                    </div>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="flex justify-center items-center px-4 py-2 space-x-2 w-full font-medium text-white bg-sky-600 rounded-lg transition-colors hover:bg-sky-700"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-sky-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-gray-400 dark:text-gray-600">
              <Search className="mx-auto w-16 h-16" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria or browse all products
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;