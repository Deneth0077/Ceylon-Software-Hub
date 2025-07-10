import React, { useState } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Minus, 
  Upload, 
  Image as ImageIcon,
  Monitor,
  Cpu,
  HardDrive,
  Tag,
  Star,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface ProductFormData {
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
  isActive: boolean;
}

interface AddProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Partial<ProductFormData>;
  loading?: boolean;
  submitText?: string;
}

// Add this constant for your Cloudinary cloud name and unsigned preset
const CLOUDINARY_CLOUD_NAME = 'portfolio-mern';
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset'; // <-- You must create this in your Cloudinary dashboard

const AddProductForm: React.FC<AddProductFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
  submitText = 'Create Product'
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'software & apps',
    images: initialData?.images || [{ url: '', alt: '' }],
    downloadUrl: initialData?.downloadUrl || '',
    systemRequirements: {
      os: initialData?.systemRequirements?.os || ['Windows 10+'],
      processor: initialData?.systemRequirements?.processor || 'Intel Core i3 or equivalent',
      memory: initialData?.systemRequirements?.memory || '4GB RAM',
      storage: initialData?.systemRequirements?.storage || '1GB available space'
    },
    version: initialData?.version || '1.0.0',
    license: initialData?.license || 'single',
    tags: initialData?.tags || [],
    features: initialData?.features || [],
    isActive: initialData?.isActive ?? true
  });

  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newOS, setNewOS] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    media: true,
    technical: true,
    metadata: true
  });

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const categories = [
    { value: 'software & apps', label: 'Software & Apps' },
    { value: 'MS office keys', label: 'MS Office Keys' },
    { value: 'Windows Keys', label: 'Windows Keys' },
    { value: 'PC games', label: 'PC Games' },
    { value: 'Cracked', label: 'Cracked' }
  ];

  const licenses = [
    { value: 'single', label: 'Single License' },
    { value: 'multiple', label: 'Multiple License' },
    { value: 'enterprise', label: 'Enterprise License' }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }
    
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    
    if (!formData.downloadUrl.trim()) {
      toast.error('Download URL is required');
      return;
    }

    // Filter out empty images
    const validImages = formData.images.filter(img => img.url.trim());
    
    const submitData = {
      ...formData,
      images: validImages.length > 0 ? validImages : [{ url: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800', alt: formData.name }]
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '' }]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, field: 'url' | 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const addOS = () => {
    if (newOS.trim() && !formData.systemRequirements.os.includes(newOS.trim())) {
      setFormData(prev => ({
        ...prev,
        systemRequirements: {
          ...prev.systemRequirements,
          os: [...prev.systemRequirements.os, newOS.trim()]
        }
      }));
      setNewOS('');
    }
  };

  const removeOS = (os: string) => {
    setFormData(prev => ({
      ...prev,
      systemRequirements: {
        ...prev.systemRequirements,
        os: prev.systemRequirements.os.filter(o => o !== os)
      }
    }));
  };

  // Cloudinary upload handler
  const handleCloudinaryUpload = async (file: File, index: number) => {
    setUploadingIndex(index);
    setUploadProgress(0);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      const imageUrl = response.data.secure_url;
      updateImage(index, 'url', imageUrl);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
      console.error(error);
    } finally {
      setUploadingIndex(null);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h3>
            </div>
            <div className={`transform transition-transform ${expandedSections.basic ? 'rotate-180' : ''}`}>
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {expandedSections.basic && (
            <div className="px-6 pb-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (Rs) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="1.0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    License Type
                  </label>
                  <select
                    value={formData.license}
                    onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    {licenses.map(license => (
                      <option key={license.value} value={license.value}>
                        {license.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Product
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Describe your product..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Download URL *
                </label>
                <input
                  type="url"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, downloadUrl: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="https://example.com/download"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Media Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => toggleSection('media')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <ImageIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Product Images
              </h3>
            </div>
            <div className={`transform transition-transform ${expandedSections.media ? 'rotate-180' : ''}`}>
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {expandedSections.media && (
            <div className="px-6 pb-6 space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={image.url}
                      onChange={(e) => updateImage(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="flex items-center mt-2 space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        id={`cloudinary-file-${index}`}
                        style={{ display: 'none' }}
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleCloudinaryUpload(e.target.files[0], index);
                          }
                        }}
                      />
                      <label htmlFor={`cloudinary-file-${index}`} className="inline-flex items-center px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer text-sm">
                        <Upload className="h-4 w-4 mr-1" /> Upload
                      </label>
                      {uploadingIndex === index && (
                        <span className="text-xs text-gray-500 ml-2">{uploadProgress}%</span>
                      )}
                    </div>
                    {image.url && (
                      <img src={image.url} alt={image.alt || 'Preview'} className="mt-2 rounded-lg w-32 h-20 object-cover border" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alt Text
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateImage(index, 'alt', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Image description"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImage}
                className="flex items-center space-x-2 px-4 py-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Technical Specifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => toggleSection('technical')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Monitor className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Requirements
              </h3>
            </div>
            <div className={`transform transition-transform ${expandedSections.technical ? 'rotate-180' : ''}`}>
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {expandedSections.technical && (
            <div className="px-6 pb-6 space-y-6">
              {/* Operating Systems */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operating Systems
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.systemRequirements.os.map((os, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{os}</span>
                        <button
                          type="button"
                          onClick={() => removeOS(os)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newOS}
                      onChange={(e) => setNewOS(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOS())}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="e.g., Windows 11, macOS 12+"
                    />
                    <button
                      type="button"
                      onClick={addOS}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Cpu className="inline h-4 w-4 mr-1" />
                    Processor
                  </label>
                  <input
                    type="text"
                    value={formData.systemRequirements.processor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      systemRequirements: { ...prev.systemRequirements, processor: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Intel Core i3 or equivalent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <HardDrive className="inline h-4 w-4 mr-1" />
                    Memory (RAM)
                  </label>
                  <input
                    type="text"
                    value={formData.systemRequirements.memory}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      systemRequirements: { ...prev.systemRequirements, memory: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="4GB RAM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <HardDrive className="inline h-4 w-4 mr-1" />
                    Storage
                  </label>
                  <input
                    type="text"
                    value={formData.systemRequirements.storage}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      systemRequirements: { ...prev.systemRequirements, storage: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="1GB available space"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => toggleSection('metadata')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Tag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tags & Features
              </h3>
            </div>
            <div className={`transform transition-transform ${expandedSections.metadata ? 'rotate-180' : ''}`}>
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {expandedSections.metadata && (
            <div className="px-6 pb-6 space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Features
                </label>
                <div className="space-y-2">
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg"
                      >
                        <Star className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span className="flex-1 text-gray-900 dark:text-white">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Add a feature..."
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{submitText}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;