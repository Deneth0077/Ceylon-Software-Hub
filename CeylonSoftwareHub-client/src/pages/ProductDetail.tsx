import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Download, 
  ShoppingCart, 
  Shield, 
  Monitor,
  HardDrive,
  Cpu,
  ArrowLeft,
  Check
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

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
  rating: {
    average: number;
    count: number;
  };
  downloads: number;
  createdBy: { name: string };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [submittingRating, setSubmittingRating] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch {
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || ''
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate('/checkout', {
        state: {
          buyNowItem: {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url || ''
          }
        }
      });
    }
  };

  const submitRating = async (rating: number) => {
    if (!id) return;
    setSubmittingRating(true);
    try {
      const response = await axios.post(`/api/products/${id}/rate`, { rating });
      setProduct(response.data); // Assume updated product returned
      setUserRating(rating);
      toast.success('Thank you for your rating!');
    } catch {
      toast.error('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 rounded-full border-b-2 border-sky-600 animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Product not found
          </h2>
          <Link
            to="/products"
            className="text-sky-600 dark:text-sky-400 hover:underline"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-sky-600 transition-colors dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden bg-white rounded-xl shadow-sm dark:bg-gray-800">
              <img
                src={product.images[selectedImage]?.url || `https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800`}
                alt={product.name}
                className="object-cover w-full h-64 sm:h-80 md:h-96 lg:h-[600px]"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-sky-600 dark:border-sky-400' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2 space-x-2">
                <span className="px-3 py-1 text-sm font-medium text-sky-800 bg-sky-100 rounded-full dark:bg-sky-900/20 dark:text-sky-400">
                  {product.category}
                </span>
                <span className="text-gray-500 dark:text-gray-400">v{product.version}</span>
              </div>
              
              <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center ml-0">
                  <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Your Rating:</span>
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={submittingRating}
                      onClick={() => submitRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          (hoverRating ?? userRating ?? 0) >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  {submittingRating && (
                    <span className="ml-2 text-xs text-gray-400">Submitting...</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{product.downloads} downloads</span>
                  <a
                    href="https://wa.me/94776309128"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 ml-4 text-sm font-medium text-white bg-green-500 rounded-full transition-colors hover:bg-green-600"
                  >
                    <FaWhatsapp className="mr-2 w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Description with support for paragraphs and points, reduced gap */}
              <div className="leading-relaxed text-gray-600 dark:text-gray-300 space-y-0.2">
                {product.description.split('\n').map((line, idx) =>
                  line.trim().startsWith('-') ? (
                    <li key={idx} className="ml-6 list-disc">{line.replace(/^-\s*/, '')}</li>
                  ) : line.trim() !== '' ? (
                    <p key={idx}>{line}</p>
                  ) : null
                )}
              </div>
            </div>

            {/* Price and Purchase */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                    {`Rs ${product.price.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    {product.license} license
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Secure Download</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  className="flex justify-center items-center px-6 py-3 space-x-2 w-full font-semibold text-white bg-sky-600 rounded-lg transition-colors hover:bg-sky-700"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex justify-center items-center px-6 py-3 space-x-2 w-full font-semibold text-white bg-emerald-600 rounded-lg transition-colors hover:bg-emerald-700"
                >
                  <Download className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
              </div>
              <p className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
                Instant download after purchase
              </p>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="flex-shrink-0 w-4 h-4 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* System Requirements */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                System Requirements
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Operating System</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {product.systemRequirements.os.join(', ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Processor</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {product.systemRequirements.processor}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <HardDrive className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Memory</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {product.systemRequirements.memory}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <HardDrive className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Storage</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {product.systemRequirements.storage}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;